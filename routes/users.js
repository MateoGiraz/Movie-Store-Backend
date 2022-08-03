const express = require('express')
const router = express.Router()
const { User, validate } = require('../models/user')
const _ = require('lodash')
const bcrypt = require('bcrypt')
const { asyncMiddleware } = require('../middleware/async')
const { auth } = require('../middleware/auth')

router.get(
  '/me',
  auth,
  asyncMiddleware(async (req, res) => {
    const user = await User.findById(req.user._id).select('-password')
    res.send(user)
  })
)

router.post(
  '/',
  asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.detalis[0].message || error)

    try {
      let user = await User.findOne({ email: req.body.email })
      if (user) return res.status(400).send('user already registered')

      user = new User(
        _.pick(req.body, ['name', 'email', 'password', 'isAdmin'])
      )
      const salt = await bcrypt.genSalt(10)
      user.password = await bcrypt.hash(user.password, salt)

      await user.save()

      const token = user.generateAuthToken()

      res
        .header('x-auth-token', token)
        .send(_.pick(user, ['name', 'email', '_id']))
    } catch (err) {
      res.status(404).send(err.message)
    }
  })
)

module.exports = router
