const app            = require('./app')
const payment        = require('./payment/server')
const errorHandler   = require('./error-handler')
const connectToStore = require('./event-store/event-store-observable')

const eventStore = connectToStore({
    prefix: 'payment', 
    ...app.param('eventStore')
})


app.use(payment({eventStore}))
app.use(errorHandler())
const service = app.listen(app.param('port'))

service.on('listening', () => app.info('"payment service" %s has started on port %d', app.param('host'), app.param('port')))