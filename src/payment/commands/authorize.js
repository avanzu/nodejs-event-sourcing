const Authorize = require('../actions/authorize')
const Task = require('fp-types/lib/task')


// eslint-disable-next-line no-unused-vars
module.exports = ({eventStore}) => params => new Promise((next, error) => {

    const {create, save, getById} = eventStore
    const {orderId}         = params
    
    getById(orderId)
        .fold( () => create(orderId), Task.of )
        .map(Authorize(params))
        .chain(save(orderId))
        .fork(error, next)

        
})