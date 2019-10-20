const Authorize = require('../actions/authorize')
const Task      = require('fp-types/lib/task')
const identity  = v => v

// eslint-disable-next-line no-unused-vars
module.exports = ({eventStore}) => params => new Promise((next, error) => {

    const {create, save, getById} = eventStore
    const {orderId}         = params
    
    getById(orderId)
        .fold( () => create(orderId), Task.of )
        .chain(identity)
        .chain(Authorize(params))
        .chain(save(orderId))
        .fork(error, next)

        
})