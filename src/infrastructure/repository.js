const Task = require('fp-types/lib/task')
const {tap} = require('ramda')
const configure = ({ eventstore, reductions, model }) => {

    const getStream = id => new Promise((resolve, reject) => eventstore.getEventStream(id, (err, stream) => err ? reject(err) : resolve(stream)))
    const addEvents = events => stream => (stream.addEvents(events), stream)
    const commit    = stream => new Promise((resolve, reject) => stream.commit( (err, stream) => err ? reject(err) : resolve(stream)))

    const takePayload = ({payload}) => payload
    const applyEvents = state => ({events}) => events.map(takePayload).reduce(reductions, state)

    const getById = id => new Task((reject, resolve) => 
        getStream(id).then(applyEvents(model())).then(resolve).catch(reject))

    const save = streamId => ({state, events}) => new Task((reject, resolve) => 
        getStream(streamId).then( addEvents(events) ).then(commit).then(applyEvents(model())).then(resolve).catch(reject))
        

    const create = id => Task.of(model()).map( state => ({...state, id }))

    return { getById, save, create }

}

module.exports = configure