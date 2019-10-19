const app = require('../app')

const server = app.listen(app.param('port'))

server.on('listening', () => app.info('application %s has started on port %d', app.param('host'), app.param('port')))