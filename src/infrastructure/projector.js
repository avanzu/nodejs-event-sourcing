const { Map } = require('immutable-ext')
const {applyTo} = require('ramda')

module.exports = (projections, options) => new Promise(resolve => {
    console.log('starting projections')
    const running = Map(projections).map(applyTo(options))
    resolve(running)
})