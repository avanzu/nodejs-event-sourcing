const {fromNullable: whenDefined } = require('fp-types/lib/either')
const {Map} = require('immutable-ext')




module.exports = (commandMap, options) => ({command, payload}) => new Promise((resolve, reject) => {

    
    const errorUnknown   = () => Object.assign(new Error(`Unknown command ${command}`), {type: 'E_COMMAND_UNKNOWN'})
    const handleCommand  = handler => handler(payload)

    const buildCommand  = configure => configure(options)
    const commands      = Map(commandMap).map(buildCommand).toObject()


    whenDefined(commands[command])
        .bimap(errorUnknown, handleCommand)
        .fold(reject, resolve)
})
