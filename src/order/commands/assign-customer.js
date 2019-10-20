
const AssignCustomer          = require('../actions/assign-customer')

module.exports = ({eventStore}) => params => new Promise((next, error) => {

    const {orderId} = params
    const {getById, save} = eventStore

    getById(orderId)
        .chain(AssignCustomer(params))
        .chain(save(orderId))
        .fork(error, next)
        
})