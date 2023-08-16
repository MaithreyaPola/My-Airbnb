const mongoose = require('mongoose');
const House = require("../models/house");
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');


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

const sample = (array) => {
    return array[Math.floor(Math.random() * array.length)];
};
const seedDB = async () => {
    await House.deleteMany({});
    for (let i = 0; i <= 10; i++) {
        const random = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 50) + 30;
        // console.log(cities[i].state);
        const house = new House({
            title: `${sample(descriptors)} ${sample(places)} `,
            location: `${cities[random].city}, ${cities[random].state}`,
            price: price,
            image: 'https://source.unsplash.com/collection/483251',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.'
        });
        await house.save();
    }
};

seedDB().then(() => {
    mongoose.connection.close();
})