const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SingleMovieSchema = new Schema({
    title: String,
    Rating: Number,
    Description: String,
    Director: String
});
module.exports = mongoose.model('SingleMovie', SingleMovieSchema);