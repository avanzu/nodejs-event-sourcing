const GENERAL_ERROR = 'E_GENERAL'
const errorOf = (message, code = GENERAL_ERROR, status = 500) => Object.assign(new Error(message), { code, status })
const throwError = (message, code = GENERAL_ERROR, status = 500) => { throw errorOf(message, code, status) }
module.exports = {
    errorOf,
    throwError,
    codes: [GENERAL_ERROR]
}