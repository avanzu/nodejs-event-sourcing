const Task           = require('fp-types/lib/task')
const noop = () => {}
module.exports = ({connection, credentials}) => {


    const subscribe = stream => new Task((reject,resolve) => {
        const subscription = {
            correlationid: undefined,
            handleEvent  : noop,
            onEvent(fn){
                this.handleEvent = fn
                return this
            },
            unsubscribe() {
                return new Promise((resolve) => connection.unsubscribeFromStream(this.correlationid, credentials, resolve))
            }
        }

        const onConfirmed  = info => resolve(Object.assign(subscription, {info}))
        const onDropped    = info => reject(Object.assign(subscription, { info }))
        const onNotHandled = info => reject(Object.assign(subscription, {info}))

        subscription.correlationid = connection
            .subscribeToStream(stream, true, e => subscription.handleEvent(e), onConfirmed, onDropped, credentials, onNotHandled )
    })

    return subscribe
}