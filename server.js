// Dependencies
var express = require("express");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");
var logger = require("morgan");

// Initialize Express
var app = express();

// Use morgan logger for logging requests
app.use(logger("dev"));
// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Routes
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

// Hook mongojs configuration to the db variable
mongoose.connect("mongodb://localhost/goodreadsScraper", { useNewUrlParser: true });


// Listen on port 3000
app.listen(3000, function () {
  console.log("App running on port 3000!");
});
