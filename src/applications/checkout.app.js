const {Router}                = require('express')
const router                  = Router()
const {commands, mutations, model}   = require('../domain/checkout')

// eslint-disable-next-line no-unused-vars
router.post('/checkout', (req, res, next) => {
    throw Object.assign(new Error('Not implemented'), {type: 'E_NOT_IMPLEMENTED', status: 501})
})

module.exports = ({commandBus, projector, repository}) => app => new Promise(resolve => {

    const eventstore    = app.get('eventstore')
    const projections   = projector(mutations)
    const store         = repository({ eventstore, projections, model })

    const handleCommand = commandBus(commands, {store})
    
    router.post('/orders', (req, res, next) => {
        handleCommand(req.body).then(result => res.json(result), next)
    })

    router.get('/orders/:id', (req, res, next) => {
        store.getById(req.params.id).fork(next, result => res.json(result) )
    })

    app.use(router)
    resolve(app)
}) 