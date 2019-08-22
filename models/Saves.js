var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var SavesSchema = new Schema({
  // `title` is required and of type String
  saved: {
    type: Boolean,
    required: true,
    default: false
  },
  // `link` is required and of type String
  notes: {
    type: String,
    required: false
  },
  book: {
    type: Schema.Types.ObjectId,
    ref: "BookList"
  }
});

var Saves = mongoose.model("Saves", SavesSchema);

module.exports = Saves;