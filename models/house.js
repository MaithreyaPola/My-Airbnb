const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const houseSchema = new Schema(
    {
        title: String,
        price: Number,
        image: String,
        description: String,
        location: String
    }
);

const House = mongoose.model("House", houseSchema);

module.exports = House;