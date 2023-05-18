const mongoose = require('mongoose');
const singleMovie = require('../models/single-movie');

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
    const c = new singleMovie({ title: 'Test Title' });
    await c.save();

}