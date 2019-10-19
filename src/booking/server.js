const {Router}         = require('express')
const router           = Router()

// eslint-disable-next-line no-unused-vars
router.post('/bookings', (req, res, next) => {
    throw Object.assign(new Error('Not implemented'), {type: 'E_NOT_IMPLEMENTED', status: 501})
})

module.exports = router