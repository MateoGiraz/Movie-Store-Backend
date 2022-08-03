const config = require('config')
const winston = require('winston')

module.exports = function () {
  if (!config.get('jwtPrivateKey')) {
    console.log('FATAL ERROR: jwtPrivateKey not found')
    process.exit(1)
  }
}
