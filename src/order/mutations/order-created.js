
module.exports = (event, state) => {
    const {id} = event
    return {...state, id}
}
