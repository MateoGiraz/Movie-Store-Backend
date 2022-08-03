const express = require('express')
const router = express.Router()
const { Customer, validate } = require('../models/customer')
const { auth } = require('../middleware/auth')
const { asyncMiddleware } = require('../middleware/async')

router.get(
  '/',
  asyncMiddleware(async (req, res) => {
    const customers = await Customer.find().sort({ name: 1 })
    res.send(customers)
  })
)

router.get(
  '/:id',
  asyncMiddleware(async (req, res) => {
    const customers = await Customer.find({ _id: req.params.id })
    res.send(customers)
  })
)

router.post(
  '/',
  auth,
  asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const customer = new Customer({
      isGold: req.body.isGold,
      name: req.body.name,
      phone: req.body.phone,
    })

    const result = await customer.save()
    res.send(result)
  })
)

router.put(
  '/:id',
  auth,
  asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const customer = await Customer.findById(req.params.id)

    customer.set({
      isGold: req.body.isGold,
      name: req.body.name,
      phone: req.body.phone,
    })

    const result = await customer.save()
    res.send(result)
  })
)

router.delete(
  '/:id',
  auth,
  asyncMiddleware(async (req, res) => {
    const result = await Customer.deleteOne({ _id: req.params.id })
    res.send(result)
  })
)

module.exports = router
