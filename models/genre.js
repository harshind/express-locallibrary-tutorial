const mongoose = require('mongoose');
const mongooseLeanVirtuals = require('mongoose-lean-virtuals');

var GenreSchema = mongoose.Schema({
    name:{type:String, minlength:3, maxlength:100, required: true}
})

// Virtual for genre's URL
GenreSchema
.virtual('url')
.get(function () {
  return '/catalog/genre/' + this._id;
});

GenreSchema.plugin(mongooseLeanVirtuals);
//Export model
module.exports = mongoose.model('Genre', GenreSchema);
