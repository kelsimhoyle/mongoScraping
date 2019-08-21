var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var SavedBookSchema = new Schema({
  // `title` is required and of type String
  title: {
    type: String,
    required: true
  },
  // `link` is required and of type String
  bookLink: {
    type: String,
    required: true
  },
  author: {
      type: String,
      required: true
  },
  authorLink: {
      type: String,
      required: true
  }
  // `save` is an object that stores a Save id
  // The ref property links the ObjectId to the Save model
  // This allows us to populate the BookList with an associated Save

});

// This creates our model from the above schema, using mongoose's model method
var SavedBook = mongoose.model("SavedBook", SavedBookSchema);

// Export the Article model
module.exports = SavedBook;
