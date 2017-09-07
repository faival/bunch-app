import BunchQuestionare from '../model/BunchQuestionare'
import BunchApi from '../api/BunchApi'


const bunchApi = new BunchApi()

const dimensionsQuestionsDataSet = bunchApi.fetchData(`getInitialData`)
const QUESTIONARE_SIZE = 30
const QUESTIONARE_REPEAT_FACTOR = 30
const bunchQuestionare = new BunchQuestionare(dimensionsQuestionsDataSet, QUESTIONARE_SIZE, QUESTIONARE_REPEAT_FACTOR)

const bunchQuestionareInitialState = bunchQuestionare.getInitialState(dimensionsQuestionsDataSet)

console.log(bunchQuestionareInitialState)

const questionare = (state = bunchQuestionareInitialState, action) => {
  switch (action.type) {
    case `ANSWERED_STEP`:


      const dimensionName = state.answers[action.selected].dimensionName



      console.log(dimensionName)

      console.log(state.steps.steps[state.steps.currentStep].questions)

      let unselected = -1

      for (let question in state.steps.steps[state.steps.currentStep].questions) {
        if (state.steps.steps[state.steps.currentStep].questions[question].id !== action.selected) {
          unselected = question
          break
        }
      }

      console.log(unselected)
      
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
          console.log(newDimension)
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
          {currentStep: state.steps.currentStep + 1},
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
      
      console.log(`dimensionsUpdated:`)
      console.log(dimensionsUpdated)


const stepsUpdated = Object.assign(
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

console.log(stepsUpdated)

      return stepsUpdated
    default:
      return state
  }
}

export default questionare