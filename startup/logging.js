const winston = require('winston')

module.exports = function () {
  process.on('uncaughtException', (err) => {
    console.log(err.message, err)
    process.exit(1)
  })

  process.on('unhandledRejection', (err) => {
    console.log(err.message, err)
    process.exit(1)
  })

  const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' }),
    ],
  })

  if (process.env.NODE_ENV !== 'production') {
    logger.add(
      new winston.transports.Console({
        format: winston.format.simple(),
      })
    )
  }
}
