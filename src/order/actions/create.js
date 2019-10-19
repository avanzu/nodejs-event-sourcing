const {OrderCreated, ItemAdded} = require('../events')

module.exports =  params => state => {
    const { items = [] } = params

    const addItemEvent     = data => ({
        eventType: ItemAdded, data 
    })

    const createOrderEvent = data => [{
        eventType: OrderCreated, data
    }]

    return createOrderEvent(state).concat(items.map(addItemEvent))
}