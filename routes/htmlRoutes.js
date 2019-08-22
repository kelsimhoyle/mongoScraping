// Require all models
var db = require("../models");
module.exports = function(app) {
    app.get("/", function(req, res) {
        res.render("index")
    })

    app.get("/viewlists", function(req, res) {
        db.List.find({})
        .then(function(dbList) {
            console.log(dbList)
            res.render("listpage", {listItems: dbList});
        })
    })

    app.get("/booklists/:id", function(req, res) {
        db.List.find({_id: req.params.id})
        .populate("bookList")
        .then(function(dbList) {
            console.log(dbList[0].bookList)
            res.render("bookslist", {title: dbList[0].listName, books: dbList[0].bookList})
        })
    })

}