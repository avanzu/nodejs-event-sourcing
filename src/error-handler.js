
// eslint-disable-next-line no-unused-vars
module.exports = () => (err, req, res, next) => {
    const status = (err.status || 500)
    res.status(status).json({
        status,
        type : err.type,
        error: err.message,
        stack: err.stack
        
    })
}