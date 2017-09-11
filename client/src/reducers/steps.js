import { dimensionsKeys, dimensionsQuestionsDataSet } from '../config/dimensions'
import sortBy from '../utils'
import BunchQuestionare from '../model/BunchQuestionare'
const getRandomDimensionKey = () => {
  return dimensionsKeys[parseInt(Math.random(1), 10)]
}

const steps = (state = [], action) => {
  switch (action.type) {
    case 'ANSWERED_STEP':
      return Object.assign({},
        ...state,
        {'steps': Object.assign(
          {},
          {currentStep: state.steps.currentStep + 1},
          {steps: state.steps.steps.map((step, index)=>{
              let stepAnswered = step
              if (index === state.steps.currentStep) {
                stepAnswered = Object.assign({}, stepAnswered, {answer: action.answer})
              }
              return stepAnswered
            }) 
          }
        )}
        )
    default:
    return state
  }
}

export default steps