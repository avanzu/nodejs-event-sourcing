const {CaptureRequested} = require('../events')
module.exports = (event, state) => {
    return { ...state, status: CaptureRequested }
}