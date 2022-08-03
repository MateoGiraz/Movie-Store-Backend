const genres = require('../routes/genres')
const customers = require('../routes/customers')
const movies = require('../routes/movies')
const rentals = require('../routes/rentals')
const users = require('../routes/users')
const auth = require('../routes/auth')
const { error } = require('../middleware/error')
const winston = require('winston')

module.exports = function (app) {
  app.use('/api/genres', genres)
  app.use('/api/customers', customers)
  app.use('/api/movies', movies)
  app.use('/api/rentals', rentals)
  app.use('/api/users', users)
  app.use('/api/auth', auth)
  app.use(function error(err, req, res, next) {
    console.log(err.message, err)
    res.status(500).send('something went wrong')
    next()
  })
}
