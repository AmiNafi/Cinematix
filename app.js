const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const singleMovie = require('./models/single-movie');
const methodOverride = require('method-override');

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

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


app.get('/', async (req, res) => {
    res.render('home');
})
app.get('/movielist', async (req, res) => {
    const { page = 1 } = req.query, lim = 21;
    const totalmovies = await singleMovie.count();
    // console.log(totalmovies);
    const movielist = await singleMovie.find({}).limit(lim).skip((page - 1) * lim);;
    res.render('movielist/index', { data: { movielist, page, totalmovies, lim } });
})
app.get('/movielist/newmovie', async (req, res) => {
    res.render('movielist/newmovie');
});
app.get('/movielist/:id', async (req, res) => {
    const curmovie = await singleMovie.findById(req.params.id);
    // console.log(curmovie);
    res.render('movielist/showmovie', { curmovie });
});
app.get('/movielist/:id/editmovie', async (req, res) => {
    const curmovie = await singleMovie.findById(req.params.id);
    res.render('movielist/editmovie', { curmovie });
});

app.post('/movielist', async (req, res) => {
    const curmovie = new singleMovie(req.body.movie);
    await curmovie.save();
    res.redirect(`/movielist/${curmovie._id}`);
});
app.put('/movielist/:id', async (req, res) => {
    const { id } = req.params;


    const curmovie = await singleMovie.findByIdAndUpdate(id, { ...req.body.movie });
    res.redirect(`/movielist/${curmovie._id}`);
});
app.delete('/movielist/:id', async (req, res) => {
    const { id } = req.params;
    await singleMovie.findByIdAndDelete(id);
    res.redirect('/movielist');
});
app.listen(8080, () => {
    console.log('Serving on port 8080');
});