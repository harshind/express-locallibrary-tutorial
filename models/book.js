var mongoose = require('mongoose');
const mongooseLeanVirtuals = require('mongoose-lean-virtuals');

var Schema = mongoose.Schema;

var Author = require("./author")
var Genre = require("./genre")

var BookSchema = new Schema(
  {
    title: {type: String, required: true},
    author: {type: Schema.ObjectId, ref: 'Author', required: true},
    summary: {type: String, required: true},
    isbn: {type: String, required: true},
    genre: [{type: Schema.ObjectId, ref: 'Genre'}]
  }
);

// Virtual for book's URL
BookSchema
.virtual('url')
.get(function () {
  return '/catalog/book/' + this._id;
});

BookSchema.plugin(mongooseLeanVirtuals);

//Export model
module.exports = mongoose.model('Book', BookSchema);