const {connect, ConnectionEvents, ReceiverEvents} = require('rhea')
const {fromNullable: whenDefined, Just } = require('fp-types/lib/maybe')

const {throwError, codes} = require('./errors')
module.exports = app => new Promise(resolve => {

    const options = app.param('amqp')
    const connection = connect(options)
    connection.on(ConnectionEvents.connectionError, ({message}) => throwError(message, codes.CONNECTION_ERROR))
    connection.on(ConnectionEvents.protocolError, ({message}) => throwError(message, codes.CONNECTION_ERROR))
    connection.on(ConnectionEvents.error, ({message}) => throwError(message, codes.GENERAL_ERROR))

    app.publish = ( topic, events ) => {
        const sender = connection.open_sender(topic)
        events.map(subject => app.on(subject, body => sender.send({subject, body})))
        return sender
    }

    app.subscribe = (name, topic, events, {durable = 2, expiry_policy = 'never'}) => {
        const receiver = connection.open_receiver({ name, source: { address: topic, durable, expiry_policy } })
        receiver.on(ReceiverEvents.message, ({message, delivery}) => {
            const {subject, body} = message
            whenDefined(events[subject]).ap(Just(body))
                .fold(() => delivery.release({undeliverable_here: true}), () => delivery.accept())
        })

        return receiver
    }

    resolve(app)
})