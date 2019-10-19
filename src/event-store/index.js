const {Connection, ExpectedVersion} = require('event-store-client')
const Task = require('fp-types/lib/task')

const makeLoader = require('./getById')
const makeWriter = require('./saveEvents')


module.exports = options => (projections, $init) => {
    const { host, port, credentials, prefix } = options
    const idOfStream = id => `${prefix}-${id}`
    const connection = new Connection({ host, port })
    const eventId = () => Connection.createGuid()
    
    const config = { 
        connection, 
        projections, 
        $init, 
        idOfStream, 
        credentials, 
        ExpectedVersion, 
        eventId  
    }

    const getById = makeLoader(config)
    const save   = makeWriter(config)

    const create = id => Task.of($init()).map( state => ({...state, id }))

    return { getById, create, save, connection }
}
