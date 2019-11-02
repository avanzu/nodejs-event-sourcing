const { PurchaseInitialized } = require('../events')
module.exports = (event, state) => ({...state, state: PurchaseInitialized})