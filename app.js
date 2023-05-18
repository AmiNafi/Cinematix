const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const singleMovie = require('./models/single-movie');

mongoose.connect('mongodb://localhost:27017/cinematix', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));



app.get('/', async (req, res) => {
    res.render('home');
})
app.get('/AddMovie', async (req, res) => {
    const movie = new singleMovie({
        title: 'Godfather',
        Rating: 10,
        Description: 'Story of mob boss vito corleone, the God Father'
    });
    await movie.save();
    res.send(movie);
});
app.listen(3000, () => {
    console.log('Serving on port 3000');
})