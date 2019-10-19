const app    = require('./app')
const orders = require('./order/server')
const errorHandler = require('./error-handler')
const connectToStore = require('./event-store')

const eventStore = connectToStore({
    prefix: 'order', 
    ...app.param('eventStore')
})

app.use(orders({ eventStore }))

app.use(errorHandler())

const service = app.listen(app.param('port'))

service.on('listening', () => app.info('"order service" %s has started on port %d', app.param('host'), app.param('port')))