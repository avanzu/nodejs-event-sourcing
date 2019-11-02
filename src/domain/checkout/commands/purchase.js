
const EnterPurchase          = require('../actions/enter-purchase')

module.exports = ({store}) => params => new Promise((next, error) => {

    const {orderId} = params
    const {getById, save} = store

    getById(orderId)
        .chain(EnterPurchase(params))
        .chain(save(orderId))
        .fork(error, next)
        
})