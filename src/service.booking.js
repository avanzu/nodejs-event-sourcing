const app    = require('./app')
const booking = require('./booking/server')
const errorHandler = require('./error-handler')
app.use(booking)
app.use(errorHandler())
const service = app.listen(app.param('port'))

service.on('listening', () => app.info('"booking service" %s has started on port %d', app.param('host'), app.param('port')))