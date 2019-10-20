const Capture = require('../actions/capture')
module.exports = ({eventStore}) => params => new Promise((resolve, reject) => {

    const {getById, save} = eventStore
    const {orderId} = params

    getById(orderId)
        .chain(Capture(params))
        .chain(save(orderId))
        .fork(reject, resolve)

})