const { of } = require('rxjs')
const {Connection, ExpectedVersion} = require('event-store-client')
const {compose} = require('ramda')

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

    const create = id => Object.assign($init(), {id})

    return { 
        getById, 
        create: compose(of, create),
        save, 
        connection 
    }
}
