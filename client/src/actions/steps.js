export const advanceStep = step => {
    return {
        type: `ANSWERED_STEP`,
        id: step.id,
        selected: step.selected
    }
}

export const getNextStep = questions => {
    return {
        type: `GET_NEXT_STEP`,
    }
}

export const getInitialStep = questions => {
    return {
        type: `GET_INITIAL_STEP`,
    }
}

export const initialDataFetched = state => {
  return {
      type: `INITIAL_DATA_FETCHED`,
      answers: state.answers,
      dimensions: state.dimensions
  }
}

export const initFetchData = () => {
  return {
    type: `INIT_FETCH_DATA`
  }
}

export const finishFetchData = () => {
  return {
    type: `FINISH_FETCH_DATA`
  }
}

export const startQuestionare = name => {
  return {
      type: `START_STEPS_QUESTIONARE`,
      name
  }
}

export const stopQuestionare = state => {
  return {
      type: `STOP_STEPS_QUESTIONARE`,
  }
}