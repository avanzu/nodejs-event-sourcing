const {v4 : generateID } = require('uuid')
const CreateOrder        = require('../actions/create')

// eslint-disable-next-line no-unused-vars
module.exports = ({eventStore}) => params => new Promise((next, error) => {

    const {create, save} = eventStore
    const id = generateID()
    
    create(id)
        .chain(CreateOrder(params))
        .chain(save(id))
        .fork(error, next)

    
        
})