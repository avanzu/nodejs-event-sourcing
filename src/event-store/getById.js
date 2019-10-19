const { prop} = require('ramda')
const {Left, Right} = require('fp-types/lib/either')
const Task = require('fp-types/lib/task')
const noop = () => {}
const fromPredicate     = predicate => value => predicate(value) ? Right(value) : Left(value)

const whenResultIsOk    = fromPredicate(({ result }) => result === 0)
const whenStreamHasMore = fromPredicate(({ isEndOfStream }) => !isEndOfStream )

module.exports = ({connection, projections, $init, idOfStream, credentials}) => {
    
    const streamReadError = ({error: message, result: code}) => Object.assign(new Error(message), {type: 'E_READ_EVENT_STREAM', status: 500, code})

    const readFromStream = (streamId, nextEventNumber, onComplete) =>
        connection.readStreamEventsForward(streamId, nextEventNumber, 1, true, false, noop, credentials, onComplete)

    // {result, error, isEndOfStream, events, nextEventNumber}
    const readEvents = (streamId, state, start, onComplete) => 
        readFromStream(streamId, start, result => {
            whenResultIsOk(result)
                .map(({events, ...rest}) => ({...rest, state: events.reduce(projections, state)}))
                .chain(whenStreamHasMore)
                .fold( onComplete, ({ nextEventNumber, state })  => readEvents(streamId, state, nextEventNumber, onComplete))
        })


    const getAggregate = id => new Task((reject, resolve) => {
        const onComplete = result => 
            whenResultIsOk(result).bimap( streamReadError, prop('state') ).fold(reject, resolve)

        readEvents(idOfStream(id), $init(), 0, onComplete)
    })

    return getAggregate
}