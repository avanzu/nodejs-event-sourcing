const eventstore = require('eventstore')
const { throwError } = require('./errors')


const connectToStore = options => new Promise((resolve, reject) => {
    const es     = eventstore(options)
    es.on('disconnect', () => throwError('eventstore disconnected'))
    es.init(err => err ? reject(err) : resolve(es))
})

module.exports = app => 
    connectToStore(app.param('eventstore'))
        .then(eventstore => app.set('eventstore', eventstore))
        
    

