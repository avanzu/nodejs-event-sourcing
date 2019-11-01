
// eslint-disable-next-line no-unused-vars
const errorHandler = () => (err, req, res, next) => {
    const status = (err.status || 500)
    res.status(status).json({
        status,
        type : err.type,
        error: err.message,
        stack: err.stack
    
    })
}

module.exports = app => new Promise(resolve => {
    app.use(errorHandler())
    resolve(app)
})
