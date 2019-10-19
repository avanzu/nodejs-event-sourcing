module.exports = (item, state) => {
    const { items = [] } = state

    return {...state, items: items.concat([item])}

}