const {OrderCreated, ItemAdded} = require('../events')

module.exports =  params => () => {
    const { id, items = [] } = params

    const addItemEvent     = data => ({
        eventType: ItemAdded, data 
    })

    const createOrderEvent = data => [{
        eventType: OrderCreated, data
    }]

    return createOrderEvent({id}).concat(items.map(addItemEvent))
}