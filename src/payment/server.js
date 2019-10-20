const {Router}         = require('express')
const router           = Router()
const configureApp  = require('./app')

module.exports = ({eventStore}) => {

    const {handleCommand, repository} = configureApp(eventStore)

    router.post('/payments', (req, res, next) => {
        handleCommand(req.body).then(result => res.json(result)).catch(next)
    })

    router.get('/payments/:id', (req, res, next) => {
        repository.getById(req.params.id).fork( next, result => res.json(result) )
    })

    return router
}