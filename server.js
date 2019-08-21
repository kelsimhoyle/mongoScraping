// Dependencies
var express = require("express");
var mongojs = require("mongojs");
var exphbs = require("express-handlebars");
// Require axios and cheerio. This makes the scraping possible
var axios = require("axios");
var cheerio = require("cheerio");

// Initialize Express
var app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Routes
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

// Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

// Database configuration
var databaseUrl = "scraper";
var collections = ["scrapedData"];


// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function (error) {
  console.log("Database Error:", error);
});




// TODO: make two more routes

// Route 1
// =======
// This route will retrieve all of the data
// from the scrapedData collection as a json (this will be populated
// by the data you scrape using the next route)

app.get("/all", (req, res) => {
  db.scrapedData.find({}, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.json(data);
    }
  })
})

// Route 2
// =======
// When you visit this route, the server will
// scrape data from the site of your choice, and save it to
// MongoDB.
// TIP: Think back to how you pushed website data
// into an empty array in the last class. How do you
// push it into a MongoDB collection instead?
// Making a request via axios for reddit's "webdev" board. The page's HTML is passed as the callback's third argument
//   axios.get("https://old.reddit.com/r/https://www.vox.com/").then(function (response) {

//     // Load the HTML into cheerio and save it to a variable
//     // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
//     var $ = cheerio.load(response.data);

//     // An empty array to save the data that we'll scrape
//     var results = [];

//     // With cheerio, find each p-tag with the "title" class
//     // (i: iterator. element: the current element)
//     $("div.c-entry-box--compact__body").each(function (i, element) {

//       // Save the text of the element in a "title" variable
//       var title = $(element).children("a").text();

//       // In the currently selected element, look at its child elements (i.e., its a-tags),
//       // then save the values for any "href" attributes that the child elements may have
//       var link = $(element).children("a").attr("href");

//       // Inser the results into the db
//       db.scrapedData.insert({
//         title: title,
//         link: link
//       }, (err, data) => {
//         if (err) {
//           console.log(err);
//         } else {
//           console.log(data)
//         }
//       })
//     });
//   });
//
app.get("/scrape", (req, res) => {
axios.get("https://www.goodreads.com/list/show/15.Best_Historical_Fiction").then(function(response) {

  // Load the HTML into cheerio and save it to a variable
  // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
  var $ = cheerio.load(response.data);

  // An empty array to save the data that we'll scrape
  var results = [];

  // With cheerio, find each p-tag with the "title" class
  // (i: iterator. element: the current element)
  $("a.bookTitle").each(function(i, element) {

    // Save the text of the element in a "title" variable
    var title = $(element).children().text();
    var bookLink = $(element).attr("href");
      var author = $(element).siblings("span").attr("itemprop", "author").children("div.authorName__container").children("a.authorName").text();
    var authorLink = $(element).siblings("span").attr("itemprop", "author").children("div.authorName__container").children("a.authorName").attr("href");

    // Save these results in an object that we'll push into the results array we defined earlier
    results.push({
      title,
      bookLink: `https://www.goodreads.com${bookLink}`,
      author,
      authorLink
    });
  });

  // Log the results once you've looped through each of the elements found with cheerio
  console.log(results);
});
res.send("scraping")
})


axios.get("https://www.goodreads.com/list").then(function(response) {
  var $ = cheerio.load(response.data);

  // An empty array to save the data that we'll scrape
  var results = [];

  // With cheerio, find each p-tag with the "title" class
  // (i: iterator. element: the current element)
  $("a.listTitle").each(function(i, element) {

    // Save the text of the element in a "title" variable
    var listName = $(element).text();
    var listLink = $(element).attr("href");

    // Save these results in an object that we'll push into the results array we defined earlier
    results.push({
      listName,
      listLink: `https://www.goodreads.com${listLink}`
    });
  });

  // Log the results once you've looped through each of the elements found with cheerio
  console.log(results);
});
/* -/-/-/-/-/-/-/-/-/-/-/-/- */



// Listen on port 3000
app.listen(3000, function () {
  console.log("App running on port 3000!");
});
