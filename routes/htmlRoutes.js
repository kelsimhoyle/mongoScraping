// Require all models
var db = require("../models");
module.exports = function(app) {
    app.get("/", function(req, res) {
        db.List.find({}).limit(parseInt(3))
        .populate({
            path: "bookList",
            options: { limit: 3 }
        })
        .then(function(dbList) {
            if (dbList) {
                return res.render("index", {layout: "homepage", listItems: dbList });
            }
        })
        .catch(function(err) {
            res.json(err);
        })
    })

    app.get("/viewlists", function(req, res) {
        db.List.find({})
        .populate({
            path: "bookList",
            options: { limit: 3 }
        })
        .then(function(dbList) {
            console.log(dbList)
            res.render("listpage", {listItems: dbList});
        })
        .catch(function(err) {
            console.log(err);
        })
    })

    app.get("/booklists/:id", function(req, res) {
        db.List.find({_id: req.params.id})
        .populate("bookList")
        .then(function(dbList) {
            console.log(dbList[0].bookList)
            res.render("bookslist", {title: dbList[0].listName, books: dbList[0].bookList})
        })
        .catch(function(err) {
            console.log(err);
        })
    })

    app.get("/savedbooks", function(req, res) {
        db.Saves.find({})
        .populate("book")
        .then(function(dbSaves) {
            res.render("saves", {saved: dbSaves});
        })
        .catch(function(req, res) {
            res.json(err);
        })
    })

}