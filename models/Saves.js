var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var SavesSchema = new Schema({
  saved: {
    type: Boolean,
    required: true,
    default: false
  },
  notes: {
    type: Array,
    required: false
  },
  book: {
    type: Schema.Types.ObjectId,
    ref: "BookList"
  }
});

var Saves = mongoose.model("Saves", SavesSchema);

module.exports = Saves;