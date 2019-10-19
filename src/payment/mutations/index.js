const events = require('../events')
const onPaymentAuthorized = require('./payment-authorized')

module.exports = {
    [events.PaymentAuthorized]: onPaymentAuthorized
}