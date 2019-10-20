const ReadStreamResultCodes = {
    0: 'Success',
    1: 'NoStream',
    2: 'StreamDeleted',
    3: 'NotModified',
    4: 'Error',
    5: 'AccessDenied'
}

const OperationResultCodes = {
    0: 'Success',
    1: 'PrepareTimeout',
    2: 'CommitTimeout',
    3: 'ForwardTimeout',
    4: 'WrongExpectedVersion',
    5: 'StreamDeleted',
    6: 'InvalidTransaction',
    7: 'AccessDenied'
}

const HttpStatusCodes = {
    Success             : [200, 'OK'],
    NoStream            : [404, 'Not Found'],
    StreamDeleted       : [410, 'Gone'],
    NotModified         : [304, 'Not Modified'],
    Error               : [500, 'Internal Server Error'],
    AccessDenied        : [403, 'Forbidden'],
    PrepareTimeout      : [504, 'Prepare Timeout'],
    CommitTimeout       : [504, 'Commit Timeout'],
    ForwardTimeout      : [504, 'Forward Timeout'],
    WrongExpectedVersion: [409, 'Conflict'],
    InvalidTransaction  : [400, 'Invalid Transaction'],
    
}



const errorFor = resultCodes => ({ result, error }) => {
    const type              = resultCodes[result]
    const [status, statusText] = HttpStatusCodes[type]

    return Object.assign(new Error(`${status} ${statusText} (${type})`), { type, status, statusText, error })
}

module.exports = {
    StreamReadError     : errorFor(ReadStreamResultCodes),
    StreamOperationError: errorFor(OperationResultCodes)
}