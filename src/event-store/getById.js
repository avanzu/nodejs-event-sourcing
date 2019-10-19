const { Observable } = require('rxjs')
const { reduce } = require('rxjs/operators')
const {compose} = require('ramda')
const {Left, Right} = require('fp-types/lib/either')
const { observableToTask } = require('../transformations')

const whenResultIsError = code => code !== 0 ? Right(code) : Left(code)
const whenTrue = value => !value ? Left(value) : Right(value)


module.exports = ({connection, projections, $init, idOfStream, credentials}) => {
    
    const readFromStream = (streamId, nextEventNumber, onEvent, done) =>
        connection.readStreamEventsForward(streamId, nextEventNumber, 100, true, false, onEvent, credentials, done)

    const streamReadError = message => code => Object.assign(new Error(message), {type: 'E_READ_EVENT_STREAM', status: 500, code})

    const observableStream  = streamId => new Observable(subscriber => {
        const onError       = error => subscriber.error(error)
        const onStreamError = compose(Right, onError)
        const onEvent       = e => subscriber.next(e)
        const complete      = () => subscriber.complete()

        const onComplete    = ({result, isEndOfStream, nextEventNumber, error}) => {

            const whenIsEndOfStream = () => whenTrue(isEndOfStream)
            const readNextPortion   = () => readFromStream(streamId, nextEventNumber, onEvent, onComplete)

            whenResultIsError(result)
                .map(streamReadError(error))
                .fold(whenIsEndOfStream, onStreamError)
                .fold(readNextPortion, complete)
        }

        readFromStream(streamId, 0, onEvent, onComplete)
    })

    const getObservableStream = compose( observableStream, idOfStream )

    const aggregateFromStream = id => getObservableStream(id).pipe(reduce(projections, $init()))

    return compose(observableToTask, aggregateFromStream)
}