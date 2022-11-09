import winston from 'winston'

export const logger: any = winston.createLogger({
  transports: [
    new winston.transports.Console({ level: 'verbose' }),
    new winston.transports.File({
      filename: './logs/info.log',
      level: 'debug'
    }),
    new winston.transports.File({
      filename: './logs/errors.log',
      level: 'error'
    })
  ]
})

logger.petition = (type = 'info', req: any) => {
  logger.log(type, `Request type ${req.method} to ${req.url}`)
}
