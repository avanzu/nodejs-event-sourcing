const {Left, Right}  = require('fp-types/lib/either')
const Task           = require('fp-types/lib/task')
const {StreamOperationError} = require('./errors')

const fromPredicate  = predicate => value => predicate(value) ? Right(value) : Left(value)
const whenResultIsOk = fromPredicate(({result}) => result === 0)

module.exports = ({connection, ExpectedVersion, credentials, idOfStream, eventId}) => {

    const toEventStoreEvent = event => ({ ...event, eventId: eventId(), metadata: {timestamp: Date.now()}})
    const toEventStoreEvents = xs => xs.map(toEventStoreEvent)

    const writeEventsTo = aggregateId => events => new Task((reject, resolve) => {
        
        const streamId = idOfStream(aggregateId)
        const generateWriteResult = ({firstEventNumber, lastEventNumber}) => ({ firstEventNumber, lastEventNumber, aggregateId, streamId })

        const onComplete = result => 
            whenResultIsOk(result)
                .bimap(StreamOperationError, generateWriteResult)
                .fold(reject, resolve)
        

        connection.writeEvents(streamId, ExpectedVersion.Any, false, events, credentials, onComplete)
    })

    const saveEvents = streamId => events => 
        Task.of(events)
            .map(toEventStoreEvents)
            .chain(writeEventsTo(streamId))

    return saveEvents
}