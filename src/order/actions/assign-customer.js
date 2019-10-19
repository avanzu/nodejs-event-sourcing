const { fromNullable } = require('fp-types/lib/either')
const { CustomerAssigned, CustomerRemoved, CustomerChanged } = require('../events')

module.exports = params =>  state => {

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

    return fromNullable(state.customer)
        .bimap(
            () => customerAssignedEvent(customer),
            previous => customerRemovedEvent(previous)
                .concat(customerAssignedEvent(customer))
                .concat(customerChangedEvent({previous, customer})),
        )
        .merge()

}