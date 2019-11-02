const eventstore = require('eventstore')
const { throwError } = require('./errors')

const connectToStore = (options, eventBus) => new Promise((resolve, reject) => {
    const store     = eventstore(options)
    store
        .on('disconnect', () => throwError('eventstore disconnected'))
        .useEventPublisher(({eventType, data}) => eventBus.emit(eventType, data))
        .init(err => err ? reject(err) : resolve(store))
})

module.exports = app => 
    connectToStore(app.param('eventstore'), app)
        .then(eventstore => app.set('eventstore', eventstore))
        
    

