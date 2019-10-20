const $init        = require('./model')
const mutations    = require('./mutations')
const commands     = require('./commands')
const commandBus   = require('../command-bus')
const projector    = require('../projector')
const eventHandler = require('./event-handler')


module.exports = configureStore => {

    
    const projections = projector( mutations )
    const eventStore = configureStore(projections, $init)
    const options    = {eventStore, $init}
    const handleCommand = commandBus(commands, options)

    eventHandler({ eventStore, handleCommand })

    return {
        handleCommand,
        repository: eventStore
    }
    
}