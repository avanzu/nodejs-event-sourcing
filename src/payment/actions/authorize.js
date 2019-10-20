const {PaymentAuthorized} = require('../events')
const Task = require('fp-types/lib/task')
// eslint-disable-next-line no-unused-vars
module.exports = params => state => new Task((reject, resolve) => {
    
    const paymentAuthrizedEvent = data => [{
        eventType: PaymentAuthorized, data
    }]

    resolve(paymentAuthrizedEvent({ ...state, ...params }))
   

})