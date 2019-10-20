const {PaymentCaptured, CaptureRequested, CapturePending, CaptureSucceeded, CaptureRejected, PaymentAuthorized } = require('../events')
const Task = require('fp-types/lib/task')
const {Left, Right} = require('fp-types/lib/either')
const {equals, prop, compose} = require('ramda')

const fromPredicate     = predicate => value => predicate(value) ? Right(value) : Left(value)
const isStatusAutorized = compose(equals(PaymentAuthorized), prop('status')) 
const whenAuthorized    = fromPredicate(isStatusAutorized)

const CaptureError = ({ status }) => {

    return Object.assign(new Error(`Status expected to be ${PaymentAuthorized} but was ${status}`), { status: 409, statusText: 'Conflict', type: 'StatusConflict' })
}

module.exports = params => state => new Task((reject, resolve) => {
    
    // eslint-disable-next-line no-unused-vars
    const captureRequestedEvent = data => state => [{
        eventType: CaptureRequested, data
    }]

    whenAuthorized(state)
        .bimap(CaptureError,  captureRequestedEvent(params))
        .fold(reject, resolve)
})