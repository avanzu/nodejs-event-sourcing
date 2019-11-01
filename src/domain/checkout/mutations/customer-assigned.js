const {omit} = require('ramda')

module.exports = (customer, state) => {
    
    return Object.assign(omit(['customer'], state), {customer})
}

