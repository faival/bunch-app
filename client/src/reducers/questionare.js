import BunchQuestionare from '../model/BunchQuestionare'

import { pushParticipantData } from '../api/BunchApi'

const QUESTIONARE_SIZE = 30
const QUESTIONARE_REPEAT_FACTOR = 2
const bunchQuestionare = new BunchQuestionare()
const bunchQuestionareInitialState = {
  dimensions: [],
  answers: [],
  steps: {
    fetching: false,
    initialized: false,
    agreed: false,
    pushed: false, 
    completed: false,
    currentStep: 0,
    steps: []
  }
}

const questionare = (state = bunchQuestionareInitialState, action) => {
  switch (action.type) {
    case `ANSWERED_STEP`:
      const dimensionName = state.answers[action.selected].dimensionName
      let unselected = -1

      for (let question in state.steps.steps[state.steps.currentStep].questions) {
        if (state.steps.steps[state.steps.currentStep].questions[question].id !== action.selected) {
          unselected = question
          break
        }
      }

      const currentStep = state.steps.currentStep + 1
      
      return Object.assign(
        {},
        {dimensions: state.dimensions.map((dimension) => {
          const selected = state.answers[action.selected].dimensionName !== dimension.name ? 
            dimension.selected :
            dimension.selected + 1
          const newDimension = Object.assign(
            {},
            dimension,
            { selected: selected }
          )
          return newDimension
        })},
        {answers: state.answers.map((answer, index) => {
          let newAnswer = answer
          if (index === action.selected) {
            newAnswer = Object.assign(
              {},
              newAnswer,
              {selected: answer.selected + 1}
            )
          }

          if (index === unselected) {
            newAnswer = Object.assign(
              {},
              newAnswer,
              {unselected: answer.unselected + 1}
            )
          }
          return newAnswer
        })},
        {steps: Object.assign(
          {},
          state.steps,
          {currentStep: currentStep},
          {completed: (currentStep > QUESTIONARE_SIZE - 1)},
          {steps: state.steps.steps.map((step, index)=>{
              let stepAnswered = step
              if (index === state.steps.currentStep) {
                stepAnswered = Object.assign({}, stepAnswered, {selected: action.selected})
              }
              return stepAnswered
            }) 
          }
        )}
       )

    case `GET_NEXT_STEP`: 
    case `GET_INITIAL_STEP`: 
      const questions = bunchQuestionare.getTargetQuestions(state)
      const dimensionsUpdated = state.dimensions.map((dimension, index) => {
          if (questions[0].dimension === dimension.id) {
            return Object.assign({}, dimension, {used: dimension.used + 1})
          } else if(questions[1].dimension === dimension.id) {
            return Object.assign({}, dimension, {used: dimension.used + 1})
          } else {
            return Object.assign({}, dimension)  
          }
      })
      const stateUpdated = Object.assign(
        {},
        {answers: state.answers.map((answer) => {
          if(answer.id === questions[0].id || answer.id === questions[1].id) {
            return Object.assign({}, answer, {used: answer.used + 1})
          }
          return answer
        })},
        {dimensions: dimensionsUpdated},
        {steps: Object.assign({},
          state.steps,
          {initialized: true},
          {steps: [...state.steps.steps, {id: state.currentStep, questions}]}
        )})

      return stateUpdated

     case `INITIAL_DATA_FETCHED`: 

      const initialState = Object.assign(
        {}, 
        {answers: action.answers},
        {dimensions: action.dimensions},
        {steps: {
          initialized: true,
          completed: false,
          currentStep: 0,
          steps: [],
        }})
      return initialState

    case `INIT_FETCH_DATA`:

      return Object.assign({}, state, { steps: Object.assign({}, state.steps, { fetching: true }) })

    case `FINISH_FETCH_DATA`:

      return Object.assign({}, state, { steps: Object.assign({}, state.steps, { fetching: false }) })

    case `START_STEPS_QUESTIONARE`:

      const isValidName = (action.name !== ``)
      const newState = Object.assign(
        {}, 
        state, 
        {
          steps: {
            fetching: false,
            agreed: isValidName,
            currentStep: 0,
            name: action.name,
            steps: state.steps.steps
          }
        }
      )

      return newState

    case `STOP_STEPS_QUESTIONARE`:
      const stopState = Object.assign({}, 
        state, 
        {
          steps: Object.assign(
            {},
            state.steps,
            {pushed: true},
            {steps: state.steps.steps}
          )
        })

      return stopState
    default:
      return state
  }
}

export default questionare