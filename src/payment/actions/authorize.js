const {PaymentAuthorized} = require('../events')
// eslint-disable-next-line no-unused-vars
module.exports = params => state => {

    const { orderId, payment } = params

    return [{
        eventType: PaymentAuthorized,
        data     : { orderId, payment }
    }]

}