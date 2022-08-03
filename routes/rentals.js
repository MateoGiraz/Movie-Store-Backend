const express = require('express')
const router = express.Router()
const { asyncMiddleware } = require('../middleware/async')
const { Movie } = require('../models/movie')
const { Customer } = require('../models/customer')
const { Rental, validate } = require('../models/rental')
const { auth } = require('../middleware/auth')
const { admin } = require('../middleware/admin')

router.get(
  '/',
  asyncMiddleware(async (req, res) => {
    const rental = await Rental.find().sort({ _id: 1 })
    res.send(rental)
  })
)

router.get(
  '/:id',
  asyncMiddleware(async (req, res) => {
    const rental = await Rental.find({ _id: req.params.id }).sort({ _id: 1 })
    res.send(rental)
  })
)

router.post(
  '/',
  auth,
  asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const { movieId, customerId, dateOut, dateReturne, rentalFee } = req.body
    const movie = await Movie.find({ _id: movieId })
    const customer = await Customer.find({ _id: customerId })

    const rental = new Rental({
      movie: movie[0],
      customer: customer[0],
      dateOut: dateOut,
      dateReturned: dateReturne,
      rentalFee: rentalFee,
    })
    const result = await rental.save()
    res.send(result)
  })
)

router.put(
  '/:id',
  auth,
  asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const { movieId, customerId, dateOut, dateReturne, rentalFee } = req.body
    const rental = await Rental.find({ _id: req.params.id })
    const movie = await Movie.find({ _id: movieId })
    const customer = await Customer.find({ _id: customerId })

    rental[0].set({
      movie: movie[0],
      customer: customer[0],
      dateOut: dateOut,
      dateReturned: dateReturne,
      rentalFee: rentalFee,
    })

    const result = await rental[0].save()
    res.send(result)
  })
)

router.delete(
  '/:id',
  [auth, admin],
  asyncMiddleware(async (req, res) => {
    const result = await Rental.deleteOne({ _id: req.params.id })
    res.send(result)
  })
)

module.exports = router
