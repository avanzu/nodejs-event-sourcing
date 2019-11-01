const application  = require('./infrastructure/app')
const payment      = require('./applications/payment.app')
const errorHandler = require('./infrastructure/error-handler')

application()
    .then(app => app.configure(payment))
    .then(app => app.configure(errorHandler))
    .then(app => ({app,service: app.listen(app.param('port'))}))
    .then(({app, service}) => service.on('listening', () => app.info('"booking service" has started', { host: app.param('host'), port: app.param('port') })))