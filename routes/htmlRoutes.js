// Require all models
var db = require("../models");
module.exports = function(app) {
    app.get("/lists", function(req, res) {
        db.List.find({})
        .then(function(dbList) {
            console.log(dbList)
            res.render("listpage", {listItems: dbList});
        })
    })

    app.get("/booklists/:id", function(req, res) {
        db.List.find({_id: req.params.id})
        .populate("bookList")
        .then(function(booklist) {
            
        })
    })
}