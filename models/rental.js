const mongoose = require('mongoose')
const Joi = require('joi')
const { MovieSchema } = require('./movie')
const { CustomerSchema } = require('./customer')

const RentalSchema = new mongoose.Schema({
  movie: {
    type: MovieSchema,
    requiered: true,
  },
  customer: {
    type: CustomerSchema,
    requiered: true,
  },
  dateOut: {
    type: 'Date',
    requierd: true,
    default: Date.now(),
  },
  dateReturned: {
    type: 'Date',
    requierd: true,
    default: Date.now(),
  },
  rentalFee: {
    type: 'Number',
    requierd: true,
    min: 0,
  },
})

const Rental = mongoose.model('Rental', RentalSchema)

function validateRental(rental) {
  const schema = Joi.object({
    movieId: Joi.string().required(),
    customerId: Joi.string().required(),
    dateOut: Joi.date().required(),
    dateReturned: Joi.date().required(),
    rentalFee: Joi.number().required(),
  })
  return schema.validate(rental)
}

module.exports.Rental = Rental
module.exports.validate = validateRental
