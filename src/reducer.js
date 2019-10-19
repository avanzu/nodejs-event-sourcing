const {fromNullable: whenDefined} = require('fp-types/lib/either')

module.exports = ({mutations, $init = {}}) => {

    const handleEvent  = (state, {eventType, data}) => {
        const skip = () => state
        const mutate = mutation => mutation( data, state)
        return whenDefined(mutations[eventType])
            .fold(skip, mutate)
    }
        
    
    const handleEvents = (events, initialState = $init) => 
        events.reduce( handleEvent , initialState)
    
    return handleEvents
}