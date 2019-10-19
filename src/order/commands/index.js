
const CreateOrder    = require('./create-order')
const AssignCustomer = require('./assign-customer')

const commandMap = { 
    CreateOrder, 
    AssignCustomer 
}

module.exports = commandMap 
