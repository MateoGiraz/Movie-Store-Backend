const Joi = require("joi");
const mongoose = require("mongoose");
const { GenreSchema } = require("./genre");

const MovieSchema = new mongoose.Schema({
  title: {
    type: 'String',
    required: true,
    minlength: 5,
    maxlength: 255,
  },
  genre: {
    type: GenreSchema,
    required: true,
  },
  numberInStock: {
    type: 'Number',
    required: true,
    min: 0,
    max: 255,
  },
  dailyRental: {
    type: 'Number',
    required: true,
    min: 0,
    max: 255,
  },
})

const Movie = mongoose.model('Movie', MovieSchema)

function validateMovie(movie) {
  const schema = Joi.object({
    title: Joi.string().min(5).required(),
    genreId: Joi.string().required(),
    numberInStock: Joi.number().required(),
    dailyRental: Joi.number().required(),
  });
  return schema.validate(movie);
}

module.exports.Movie = Movie;
module.exports.MovieSchema = MovieSchema;
module.exports.validate = validateMovie;
