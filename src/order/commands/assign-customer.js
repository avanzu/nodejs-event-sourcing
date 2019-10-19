
const AssignCustomer          = require('../actions/assign-customer')
const {map, mergeMap} = require('rxjs/operators')


module.exports = ({eventStore}) => params => new Promise((next, error) => {

    const {orderId} = params
    const {getById, save} = eventStore
    const assignCustomerToOrder = map(AssignCustomer(params))
    const saveOrder             = mergeMap(save(orderId))

    getById(orderId)
        .pipe(assignCustomerToOrder, saveOrder)
        .subscribe({next, error})
        
})