const events = require('../events')
const onPaymentAuthorized = require('./payment-authorized')
const onPaymentCaptured = require('./payment-captured')
const onCaptureRequested = require('./capture-requested')

module.exports = {
    [events.PaymentAuthorized]: onPaymentAuthorized,
    [events.PaymentCaptured]  : onPaymentCaptured,
    [events.CaptureRequested] : onCaptureRequested
}