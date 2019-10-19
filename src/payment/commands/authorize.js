const Authorize        = require('../actions/authorize')
const {map, mergeMap, catchError }  = require('rxjs/operators')
const { of } = require('rxjs')

// eslint-disable-next-line no-unused-vars
module.exports = ({eventStore}) => params => new Promise((next, error) => {

    const {create, save, getById} = eventStore
    const {orderId}         = params
    const createOrderWithId = map(Authorize(params))
    const saveOrderWithId   = mergeMap(save(orderId))
    const findByOrderId     = mergeMap(getById)
    
    
    of(orderId)
        .pipe( findByOrderId )
        .pipe( catchError( () =>  create(orderId)))
        .pipe(createOrderWithId, saveOrderWithId)
        .subscribe({next, error})

    
        
})