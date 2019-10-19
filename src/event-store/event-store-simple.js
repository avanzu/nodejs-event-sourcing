const {Connection, ExpectedVersion} = require('event-store-client')
const noop = () => {}

module.exports = options => {
    const { host, port, credentials, prefix } = options
    const idOfStream = id => `${prefix}-${id}`
    const connection = new Connection({ host, port })

    const toEventStoreEvent = event =>
        Object.assign(event, {
            eventId : Connection.createGuid(),
            metadata: {
                timestamp: Date.now()
            }
        })
    
    const readFromStream = (streamId, nextEventNumber, done) => 
        connection.readStreamEventsForward(streamId, nextEventNumber, 1, true, false, noop, credentials, done)
        

    const readEvents = (streamId, onComplete, start = 0, stream = []) => 
        readFromStream(streamId, start, ({isEndOfStream, events, nextEventNumber}) => 
            isEndOfStream ? onComplete(stream.concat(events)) : readEvents(streamId, onComplete, nextEventNumber, stream.concat(events)))
    
    const getById = id => new Promise(resolve => readEvents(idOfStream(id), resolve))

    const save = ({ events, streamId }) =>
        new Promise(resolve => {
            const onWriteFinished = ({ result, message, firstEventNumber, lastEventNumber }) =>
                resolve({ result, message, firstEventNumber, lastEventNumber, streamId })

            connection.writeEvents(
                idOfStream(streamId),
                ExpectedVersion.Any,
                false,
                events.map(toEventStoreEvent),
                credentials,
                onWriteFinished
            )
        })

    return { getById, save }
}
