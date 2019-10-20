const {PaymentAuthorized} = require('../events')
module.exports = (event, state) => {


    return {
        ...state, 
        ...event,
        status: PaymentAuthorized
    }
}