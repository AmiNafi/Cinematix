const mongoose = require('mongoose');
const singleMovie = require('../models/single-movie');
const movielist = require('./movielist');
mongoose.connect('mongodb://localhost:27017/cinematix', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});
const seedDB = async () => {
    await singleMovie.deleteMany({});
    for (let i = 0; i < movielist.length; i++) {
        const curmovie = new singleMovie({
            title: `${movielist[i].title}`,
            director: `${movielist[i].director}`,
            rating: `${movielist[i].rating}`,
            summary: `${movielist[i].summary}`,
            poster: `${movielist[i].poster}`,
            year: `${movielist[i].year}`,
            genre: `${movielist[i].genre}`,
            scenesnap: `${movielist[i].scenesnap}`
            // rating: parseFloat((`${movielist[i].rating}`).toString()),
        })
        await curmovie.save();
    }
}
seedDB().then(() => {
    mongoose.connection.close();
});