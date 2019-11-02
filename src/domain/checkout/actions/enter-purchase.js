const { Left, Right } = require('fp-types/lib/either')
const {equals, prop, compose} = require('ramda')
const { InvalidAction } = require('../errors')
const { PurchaseInitialized } = require('../events')
const Task = require('fp-types/lib/task')

const fromPredicate = predicate => value => predicate(value) ? Right(value) : Left(value)

const isStateNew = compose(equals('new'), prop('state'))
const whenStateMatches = fromPredicate(isStateNew)


// eslint-disable-next-line no-unused-vars
module.exports = params =>  state => new Task((reject, resolve) => {

    const resolveState = state => events => resolve({state, events})

    const purchaseInitializedEvent = ({id}) => [{
        eventType: PurchaseInitialized, 
        data     : {id, state: PurchaseInitialized} 
    }]

    whenStateMatches(state)
        .bimap( 
            state => InvalidAction(`Cannot initialize purcase when state is "${state.state}"`),  
            state => purchaseInitializedEvent(state)
        )
        .fold( reject , resolveState(state))

})