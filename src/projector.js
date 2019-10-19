const {fromNullable: whenDefined} = require('fp-types/lib/either')
module.exports = (projections) => {

    const project  = (state, {eventType, data}) => {
        
        const skip = () => state
        const applyProjection = projection => projection(data, state)

        return whenDefined(projections[eventType]).fold(skip, applyProjection)
    }

    return project 
    
}