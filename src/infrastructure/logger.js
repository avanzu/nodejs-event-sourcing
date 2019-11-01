/* istanbul ignore file */
const { createLogger, format, transports } = require('winston')

// eslint-disable-next-line no-unused-vars
const { combine, splat, timestamp, json, prettyPrint, colorize, simple} = format

const dispatchTable = patterns => val => (patterns[val]||patterns['_default'])(val)

const formatFor = dispatchTable({
    development: () => combine(timestamp(), json(), prettyPrint()),
    test       : () => combine(timestamp(), splat(), simple()),
    _default   : () => combine(timestamp(), json()) 
})

const transportsFor = dispatchTable({
    _default: () => [new transports.Console()],
    test    : () => [new transports.File({ filename: 'test.log', level: (process.env.LOG_LEVEL||'info') })],
})

// Configure the Winston logger. For the complete documentation see https://github.com/winstonjs/winston
const logger = createLogger({
    // To see more detailed errors, change this to 'debug'
    level     : (process.env.LOG_LEVEL||'info'),
    format    : formatFor(process.env.NODE_ENV),
    transports: transportsFor(process.env.NODE_ENV),
    // exitOnError: true
})

process.on('uncaughtException', err => logger.error('uncaught exception: ', err))
process.on('unhandledRejection', (reason, p) => logger.error('unhandled rejection: ', reason, p))

module.exports = logger