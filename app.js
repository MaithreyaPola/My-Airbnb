const express = require("express");
const path = require("path");
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const joi = require('joi');
const houseSchema = require('./schema.js');
const House = require("./models/house");
const AppError = require("./errorHandling/errFn.js");
const catchAsync = require("./errorHandling/catchAsync.js");

const app = express();

async function main() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/zenstay');
        console.log("DB Connected");
    } catch (err) {
        console.log("erroe occured");
        console.log(err);
    }
}
main();

app.engine('ejs', ejsMate);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const validateSchema = (req, res, next) => {
    const { error } = houseSchema.validate(req.body);
    if (error) {
        const message = error.details.map(element => element.message).join(',');
        throw new AppError(message, 400);
    }
    else {
        next();
    }
}

app.get("/", (req, res) => {
    res.render("home");
});

app.get('/housebase', catchAsync(async (req, res) => {
    const housebase = await House.find({});
    res.render('housebases/index', { housebase });
}));

app.get('/housebase/new', async (req, res) => {
    res.render('housebases/new');
});

app.post('/housebase', validateSchema, catchAsync(async (req, res, next) => {
    const newHouse = new House(req.body.housebase);
    await newHouse.save();
    res.redirect(`/housebase/${newHouse._id}`);
}));

app.get('/housebase/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const housebase = await House.findById(id);
    res.render('housebases/show', { housebase });
}));

app.get('/housebase/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const housebase = await House.findById(id);
    // console.log(housebase)
    res.render('housebases/edit', { housebase });
}));

app.put('/housebase/:id', validateSchema, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const updatedHouse = await House.findByIdAndUpdate(id, { ...req.body.housebase });
    console.log(req.body)
    await updatedHouse.save();
    res.redirect(`${updatedHouse._id}`);
}));

app.delete('/housebase/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await House.findByIdAndDelete(id);
    res.redirect("/housebase");
}));

app.all("*", (req, res, next) => {
    next(new AppError('Page not found', 404));
});

app.use((err, req, res, next) => {
    const { message = 'Error Occured', status = 500 } = err;
    res.status(status).render('error', { err });
});

app.listen("1000", () => {
    console.log("listening on PORT 1000");
});