// Require axios and cheerio. This makes the scraping possible
var axios = require("axios");
var cheerio = require("cheerio");
// Require all models
var db = require("../models");
var mongoose = require("mongoose");

module.exports = function (app) {
    // Scraping the Popular Lists

    app.get("/scrape/list", (req, res) => {
        mongoose.connection.db.dropDatabase(function(err, result) {
            if (err) console.log(err);

            console.log(result);
        })


        axios.get("https://www.goodreads.com/list/popular_lists").then(function (response) {
            var $ = cheerio.load(response.data);

            $("a.listTitle").each(function (i, element) {
                var result = {};

                result.listName = $(element).text();
                result.listLink = $(element).attr("href");

                db.List.create(result)
                    .then(function (dbList) {
                        // Getting the books for each of the lists
                        axios.get(`https://www.goodreads.com${dbList.listLink}`).then(function (response) {
                            var $ = cheerio.load(response.data);
                            $("a.bookTitle").each(function (i, element) {
                                var title = $(element).children().text();
                                var bookLink = $(element).attr("href");
                                var image = $(element).parent().siblings("div.tooltipTrigger").children("a").attr();
                                var author = $(element).siblings("span").attr("itemprop", "author").children("div.authorName__container").children("a.authorName").text();
                                var authorLink = $(element).siblings("span").attr("itemprop", "author").children("div.authorName__container").children("a.authorName").attr("href");
                                console.log(image);
                                db.BookList.create({
                                    title,
                                    bookLink: `https://www.goodreads.com${bookLink}`,
                                    image,
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
                                        console.log(err);
                                    });
                            });
                        });
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
            });
        });
        res.send("scrape complete")
    })

    app.get("/api/lists", function (req, res) {
        db.List.find({})
            .then(function (dbList) {
                res.json(dbList);
            })
            .catch(function(err) {
                res.json(err);
            })
    });

    app.get("/api/lists/:num", function (req, res) {
        db.List.find({}).limit(parseInt(req.params.num))
        .populate({
            path: "bookList",
            options: { limit: 3 }
        })
        .then(function(dbList) {
            res.json(dbList);
        })
        .catch(function(err) {
            res.json(err);
        })
    })

    // Get a specific book
    app.get("/api/book/:id", function (req, res) {
        db.BookList.findOne({ _id: req.params.id })
            .populate("savedBook")
            .then(function (dbBook) {
                res.json(dbBook)
            })
            .catch(function (err) {
                res.json(err);
            })
    })

    app.get("/api/book", function (req, res) {
        db.BookList.find({})
            .then(function (dbBook) {
                res.json(dbBook);
            })
            .catch(function (err) {
                console.log(err);
            })
    })
    // Saving the book with notes
    app.post("/api/savedbook/:id", function (req, res) {
        console.log(req.body);
        db.Saves.create(req.body)
            .then(function (dbSavedBook) {
                console.log(dbSavedBook)
                return db.BookList.findOneAndUpdate({ _id: req.params.id }, { savedBook: dbSavedBook._id }, { new: true })
                    .then(function (dbBookList) {
                        res.json(dbBookList);
                    })
                    .catch(function (err) {
                        res.json(err)
                    })
            })
            .catch(function (err) {
                res.json(err);
            })
    });

    app.get("/api/savedbook", function (req, res) {
        db.Saves.find({})
            .populate("book")
            .then(function (dbSaves) {
                res.json(dbSaves);
            })
            .catch(function (req, res) {
                res.json(err);
            })
    })
}