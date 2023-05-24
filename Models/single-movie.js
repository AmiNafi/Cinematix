const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SingleMovieSchema = new Schema({
    title: String,
    rating: Number,
    year: Number,
    director: String,
    genre: String,
    summary: String,
    poster: String,
    scenesnap: String
});
module.exports = mongoose.model('SingleMovie', SingleMovieSchema);