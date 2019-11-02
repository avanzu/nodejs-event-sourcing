const events = require('../events')

module.exports = ({app}) => {
    app.publish( 'checkout', [
        events.PurchaseInitialized, 
        events.OrderPurchased, 
        events.PurchaseRejected,
        events.Purchased, 
        events.OrderCanceled,
        events.OrderRejected
    ])
}