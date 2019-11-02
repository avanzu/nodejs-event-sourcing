const {Router}                = require('express')
const router                  = Router()
const {commands, mutations, model, projections}   = require('../domain/checkout')

module.exports = ({commandBus, reducer, repository, projector }) => app => new Promise(resolve => {

    const eventstore    = app.get('eventstore')
    const reductions    = reducer(mutations)
    const store         = repository({eventstore, model, reductions})
    
    app.useCommandHandler(commandBus(commands, {store}))
    app.useStore(store)

    
    router.post('/orders', (req, res, next) => {
        app.handleCommand(req.body).then(result => res.json(result), next)
    })

    router.get('/orders/:id', (req, res, next) => {
        store.getById(req.params.id).fork(next, result => res.json(result) )
    })

    app.use(router)

    projector(projections, {eventstore, app}).then(() => resolve(app))
}) 