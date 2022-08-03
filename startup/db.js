const winston = require('winston')
const mongoose = require('mongoose')

module.exports = function () {
  mongoose
    .connect('mongodb://localhost/vidly')
    .then(() => console.log('Connected to the database...'))
    .catch((err) => {
      console.log(`Could not connect to the database on error: ${err}`)
      process.exit(1)
    })
}
