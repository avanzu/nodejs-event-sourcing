
const AssignCustomer          = require('../actions/assign-customer')

module.exports = ({store}) => params => new Promise((next, error) => {

    const {orderId} = params
    const {getById, save} = store

    getById(orderId)
        .chain(AssignCustomer(params))
        .chain(save(orderId))
        .fork(error, next)
        
})