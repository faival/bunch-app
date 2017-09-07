let nextBunchId = 0
export const addBunch = text => {
    return {
        type: `ADD_BUNCH`,
        id: nextBunchId++, 
        text
    }
}
