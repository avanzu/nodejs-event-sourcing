const { prop} = require('ramda')
const {Left, Right} = require('fp-types/lib/either')
const Task = require('fp-types/lib/task')
const {StreamReadError} = require('./errors')
const noop = () => {}



const fromPredicate     = predicate => value => predicate(value) ? Right(value) : Left(value)

const whenResultIsOk    = fromPredicate(({ result }) => result === 0)
const whenStreamHasMore = fromPredicate(({ isEndOfStream }) => !isEndOfStream )
const takeState         = prop('state')

module.exports = ({connection, projections, $init, idOfStream, credentials}) => {
    
    const readFromStream = (streamId, nextEventNumber, onComplete) =>
        connection.readStreamEventsForward(streamId, nextEventNumber, 1, true, false, noop, credentials, onComplete)

    /**
     * 
     * @param {string} streamId 
     * @param {object} state 
     * @param {int} start 
     * @param {function} onComplete 
     */
    const readEvents = (streamId, state, start, onComplete) => 
        readFromStream(streamId, start, result => {
            const projectEventsOnState = ({events, ...rest}) => ({...rest, state: events.reduce(projections, state)})
            const readNextBatch = ({ nextEventNumber, state })  => readEvents(streamId, state, nextEventNumber, onComplete)

            whenResultIsOk(result)
                .map(projectEventsOnState)
                .chain(whenStreamHasMore)
                .fold( onComplete, readNextBatch )
        })


    const getAggregate = id => new Task((reject, resolve) => {
        const onComplete = result => 
            whenResultIsOk(result).bimap( StreamReadError, takeState ).fold(reject, resolve)

        readEvents(idOfStream(id), $init(), 0, onComplete)
    })

    return getAggregate
}