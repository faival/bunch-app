const bunches = (state = [], action) => {
  switch (action.type) {
    case 'ADD_BUNCH':
      return [
        ...state,
        {
          id: action.id,
          text: action.text,
          rate: 0
        }
      ]
    case 'RATE_BUNCH':
      return state.map(bunch =>
        (bunch.id === action.id) 
          ? {...bunch, rate: bunch.rate + action.rate}
          : bunch
      )
    default:
      return state
  }
}

export default bunches