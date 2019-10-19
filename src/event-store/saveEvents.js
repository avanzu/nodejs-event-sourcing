const {Left, Right}  = require('fp-types/lib/either')
const Task           = require('fp-types/lib/task')
const whenResultIsOk = code => code === 0 ? Right(code) : Left(code)

module.exports = ({connection, ExpectedVersion, credentials, idOfStream, eventId}) => {

    const streamWriteError = message => code => Object.assign(new Error(message), {type: 'E_WRITE_EVENT_STREAM', status: 500, code})
    const toEventStoreEvent = event => Object.assign(event, { eventId: eventId(), metadata: {timestamp: Date.now()}})
    const toEventStoreEvents = xs => xs.map(toEventStoreEvent)

    const writeEventsTo = aggregateId => events => new Task((reject, resolve) => {
        const streamId = idOfStream(aggregateId)
        const onComplete = ({ result, message, firstEventNumber, lastEventNumber, error }) => 
            whenResultIsOk(result)
                .bimap(streamWriteError(error), () => ({result, message, firstEventNumber, lastEventNumber, aggregateId, streamId}))
                .fold(reject, resolve)
        

        connection.writeEvents(streamId, ExpectedVersion.Any, false, events, credentials, onComplete)
    })

    const saveEvents = streamId => events => 
        Task.of(events)
            .map(toEventStoreEvents)
            .chain(writeEventsTo(streamId))

    return saveEvents
}