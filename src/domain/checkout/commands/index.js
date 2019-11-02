
const CreateOrder    = require('./create-order')
const AssignCustomer = require('./assign-customer')
const Purchase       = require('./purchase')

const commandMap = { 
    CreateOrder, 
    AssignCustomer,
    Purchase
}

module.exports = commandMap 
