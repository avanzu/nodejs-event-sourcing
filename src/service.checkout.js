const app    = require('./app')
const checkout = require('./checkout/server')
const errorHandler = require('./error-handler')
app.use(checkout)
app.use(errorHandler())
const service = app.listen(app.param('port'))

service.on('listening', () => app.info('"checkout service" %s has started on port %d', app.param('host'), app.param('port')))