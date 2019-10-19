const {v4 : generateID } = require('uuid')
const CreateOrder        = require('../actions/create')
const {map, mergeMap}    = require('rxjs/operators')

// eslint-disable-next-line no-unused-vars
module.exports = ({eventStore}) => params => new Promise((next, error) => {

    const {create, save} = eventStore
    const id = generateID()
    const createOrderWithId = map(CreateOrder({...params, id}))
    const saveOrderWithId   = mergeMap(save(id))

    create(id)
        .pipe(createOrderWithId, saveOrderWithId)
        .subscribe({next, error})

    
        
})