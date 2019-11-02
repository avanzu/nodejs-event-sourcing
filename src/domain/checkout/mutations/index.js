
const events             = require('../events')
const onOrderCreated     = require('./order-created')
const onCustomerAssigned = require('./customer-assigned')
const onCustomerRemoved  = require('./customer-removed')
const onItemAdded        = require('./item-added')
const onPurchaseInitialized = require('./purchase-initialized')

const mutations = {
    [events.OrderCreated]       : onOrderCreated,
    [events.CustomerAssigned]   : onCustomerAssigned,
    [events.CustomerRemoved]    : onCustomerRemoved,
    [events.ItemAdded]          : onItemAdded,
    [events.PurchaseInitialized]: onPurchaseInitialized,
}

module.exports = mutations 