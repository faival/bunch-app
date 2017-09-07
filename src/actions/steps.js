export const advanceStep = step => {
    return {
        type: `ANSWERED_STEP`,
        id: step.id,
        selected: step.selected
    }
}

export const getNextStep = questions => {
    return {
        type: `GET_INITIAL_STEP`,
    }
}