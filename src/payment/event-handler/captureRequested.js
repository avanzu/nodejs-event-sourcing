const {CapturePending, CaptureSucceeded, CaptureRejected} = require('../events')
const {promiseFromTask} = require('../../transformations')
const {compose, path} = require('ramda')

module.exports = ({ eventStore }) => {
    const { subscribe, save } = eventStore
    const onCaptureRequested = event => {
        const id = path(['data','orderId'],  event)
        const saveToStream =  save(id)
        saveToStream([ {eventType: CapturePending, data: {id} }])
            .chain(() => saveToStream([{eventType: CaptureSucceeded, data: { id } }]) )
            .fork(e => console.error('save error', e), s => console.log('saved', s))
    }

    subscribe('capture-requests')
        .map(subscription => subscription.onEvent( onCaptureRequested ))
        .fork( e => console.error('subscription error', e), o => console.log('subscription', o) )
    
}