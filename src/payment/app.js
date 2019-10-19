const $init      = require('./model')
const mutations  = require('./mutations')
const commands   = require('./commands')
const commandBus = require('../command-bus')
const projector  = require('../projector')



module.exports = configureStore => {

    
    const projections = projector( mutations )
    const eventStore = configureStore(projections, $init)
    const options    = {eventStore, $init}

    return {
        handleCommand: commandBus(commands, options),
        repository   : eventStore
    }
    
}