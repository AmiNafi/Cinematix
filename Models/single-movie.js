const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SingleMovieSchema = new Schema({
    title: String,
    rating: Number,
    description: String,
    director: String,
    poster: String
});
module.exports = mongoose.model('SingleMovie', SingleMovieSchema);