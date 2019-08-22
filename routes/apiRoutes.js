// Require axios and cheerio. This makes the scraping possible
var axios = require("axios");
var cheerio = require("cheerio");
// Require all models
var db = require("../models");

module.exports = function (app) {

    app.get("/scrape/list", (req, res) => {
        axios.get("https://www.goodreads.com/list/popular_lists").then(function (response) {
            var $ = cheerio.load(response.data);

            $("a.listTitle").each(function (i, element) {
                var result = {};

                result.listName = $(element).text();
                // splitting on the "/" and slicing the first "/", joining with a "-" so it will work in the req.params
                result.listLink = $(element).attr("href");

                db.List.create(result)
                    .then(function (dbList) {
                    
                        axios.get(`https://www.goodreads.com${dbList.listLink}`).then(function (response) {

                            // Load the HTML into cheerio and save it to a variable
                            // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
                            var $ = cheerio.load(response.data);
                            // With cheerio, find each p-tag with the "title" class
                            // (i: iterator. element: the current element)
                            $("a.bookTitle").each(function (i, element) {
                
                                // Save the text of the element in a "title" variable
                                var title = $(element).children().text();
                                var bookLink = $(element).attr("href");
                                var author = $(element).siblings("span").attr("itemprop", "author").children("div.authorName__container").children("a.authorName").text();
                                var authorLink = $(element).siblings("span").attr("itemprop", "author").children("div.authorName__container").children("a.authorName").attr("href");
                
                                db.BookList.create({
                                    title,
                                    bookLink: `https://www.goodreads.com${bookLink}`,
                                    author,
                                    authorLink
                                })
                                    .then(function (dbBookList) {
                                        return db.List.updateOne({ _id: dbList._id }, { $push: { bookList: dbBookList._id } });
                                    })
                                    .then(function (dbList) {
                                        console.log(dbList)
                                    })
                                    .catch(function (err) {
                                        // If an error occurred, log it
                                        console.log(err);
                                    });
                
                            });
                        });
                    })
                    .catch(function (err) {
                        // If an error occurred, log it
                        console.log(err);
                    });
            });
        });
        res.send("scrape complete")
    })

    app.get("/lists", function(req, res) {
        db.List.find({})
        .then(function(dbList) {
            res.json(dbList);
        })
    })
}