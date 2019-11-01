const {OrderCreated, ItemAdded} = require('../events')
const Task = require('fp-types/lib/task')

module.exports =  params => state => new Task((reject, resolve) => {
    const { items = [] } = params

    const addItemEvent     = data => ({
        eventType: ItemAdded, data 
    })

    const createOrderEvent = data => [{
        eventType: OrderCreated, data
    }]
    const events = createOrderEvent(state).concat(items.map(addItemEvent))
    resolve({state, events})
})