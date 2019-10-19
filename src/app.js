/* eslint-disable no-console */
const logger  = require('./logger')
const config  = require('config')
const express = require('express')
const cors    = require('cors')
const path     = require('path')
const favicon  = require('serve-favicon')
const compress = require('compression')
const helmet   = require('helmet')


const app = Object.assign(express(), {
    param   : name => config.get(name),  
    hasParam: name => config.has(name),
    info    : (...args) => logger.info(...args),
    error   : (...args) => logger.error(...args),
    debug   : (...args) => logger.debug(...args)
})



app.use(cors())
app.use(helmet())
app.use(cors())
app.use(compress())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(favicon(path.join(app.param('public'), 'favicon.ico')))
// Host the public folder
app.use('/', express.static(app.param('public')))

module.exports = app