const { fromNullable } = require('fp-types/lib/either')
const { CustomerAssigned, CustomerRemoved, CustomerChanged } = require('../events')
const Task = require('fp-types/lib/task')
module.exports = params =>  state => new Task((reject, resolve) => {

    const {customer} = params

    const customerAssignedEvent = data => [{
        eventType: CustomerAssigned,data 
    }]

    const customerRemovedEvent = data => [{
        eventType: CustomerRemoved, data
    }]

    const customerChangedEvent = data => [{
        eventType: CustomerChanged, data
    }]

    fromNullable(state.customer)
        .bimap(
            () => customerAssignedEvent(customer),
            previous => customerRemovedEvent(previous).concat(customerAssignedEvent(customer)).concat(customerChangedEvent({previous, customer})),
        )
        .fold(resolve, resolve)

})