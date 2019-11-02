const { Map } = require('immutable-ext')
const domainError = code =>  message => Object.assign(new Error(message), {code, type: 'E_DOMAIN'})

const errorCodes = {
    InvalidAction: 'Invalid action'
}

module.exports = Map(errorCodes).map(domainError).concat(Map({ domainError, errorCodes })).toObject()

