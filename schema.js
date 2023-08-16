const joi = require('joi');

const houseSchema = joi.object({
    housebase: joi.object({
        title: joi.string().required(),
        location: joi.string().required(),
        image: joi.string().required(),
        price: joi.number().required().min(0),
        description: joi.string().required()
    })
})

module.exports = houseSchema;