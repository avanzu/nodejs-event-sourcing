const {PaymentCaptured} = require('../events')
module.exports = (event, state) => {
    return { ...state, status: PaymentCaptured }
}