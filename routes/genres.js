const express = require('express')
const router = express.Router()
const { asyncMiddleware } = require('../middleware/async')
const { Genre, validate } = require('../models/genre')
const { auth } = require('../middleware/auth')
const { admin } = require('../middleware/admin')

router.get(
  '/',
  asyncMiddleware(async (req, res) => {
    const genres = await Genre.find().sort({ _id: 1 })
    res.send(genres)
  })
)

router.get(
  '/:id',
  asyncMiddleware(async (req, res) => {
    const genre = await Genre.find({ _id: req.params.id })
    res.send(genre)
  })
)

router.post(
  '/',
  auth,
  asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const genre = new Genre({
      name: req.body.name,
    })

    const result = await genre.save()
    res.send(result)
  })
)

router.put(
  '/:id',
  auth,
  asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const genre = await Genre.findById(req.params.id)

    genre.set({
      name: req.body.name,
    })

    const result = await genre.save()
    res.send(result)
  })
)

router.delete(
  '/:id',
  [auth, admin],
  asyncMiddleware(async (req, res) => {
    const result = await Genre.deleteOne({ _id: req.params.id })
    res.send(result)
  })
)

module.exports = router
