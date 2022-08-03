const express = require('express')
const router = express.Router()
const { asyncMiddleware } = require('../middleware/async')
const { Movie, validate } = require('../models/movie')
const { Genre } = require('../models/genre')
const { auth } = require('../middleware/auth')
const { admin } = require('../middleware/admin')

router.get(
  '/',
  asyncMiddleware(async (req, res) => {
    const movies = await Movie.find().sort({ title: 1 })
    res.send(movies)
  })
)

router.get(
  '/:id',
  asyncMiddleware(async (req, res) => {
    const movie = await Movie.find({ _id: req.params.id })
    res.send(movie)
  })
)

router.post(
  '/',
  auth,
  asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const genre = await Genre.find({ _id: req.body.genreId })

    const movie = new Movie({
      title: req.body.title,
      genre: {
        name: genre[0].name,
        _id: genre._id,
      },
      numberInStock: req.body.numberInStock,
      dailyRental: req.body.dailyRental,
    })
    const result = await movie.save()
    res.send(result)
  })
)

router.put(
  '/:id',
  auth,
  asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const movie = await Movie.findById(req.params.id)
    const genre = await Genre.find({ _id: req.body.genreId })

    movie.set({
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre[0].name,
      },
      numberInStock: req.body.numberInStock,
      dailyRental: req.body.dailyRental,
    })

    const result = await movie.save()
    res.send(result)
  })
)

router.delete(
  '/:id',
  [auth, admin],
  asyncMiddleware(async (req, res) => {
    const result = await Movie.deleteOne({ _id: req.params.id })
    res.send(result)
  })
)

module.exports = router
