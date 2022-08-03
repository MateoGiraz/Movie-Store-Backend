const express = require('express')
const router = express.Router()
const { User } = require('../models/user')
const _ = require('lodash')
const bcrypt = require('bcrypt')
const Joi = require('joi')
const { asyncMiddleware } = require('../middleware/async')

router.post(
  '/',
  asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.detalis[0].message)

    let user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(400).send('Invalid email/password')

    const isValid = await bcrypt.compare(req.body.password, user.password)
    if (!isValid) return res.status(400).send('Invalid email/password')

    const token = user.generateAuthToken()
    res.send(token)
  })
)

function validate(req) {
  const schema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  })
  return schema.validate(req)
}

module.exports = router
