var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ListSchema = new Schema({
    // `title` is required and of type String
    listName: {
        type: String,
        required: true
    },
    // `link` is required and of type String
    listLink: {
        type: String,
        required: true
    },
    // booklist is an array because it a list of book objects
    bookList: [
        {
            type: Schema.Types.ObjectId,
            ref: "BookList"
        }
    ]
});

// This creates our model from the above schema, using mongoose's model method
var List = mongoose.model("List", ListSchema);

// Export the Article model
module.exports = List;
