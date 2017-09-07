import sortBy from '../utils'

class BunchQuestionare {

  assertQuestionareSizeValid() {
    const dimensionDataSet = this.dimensions[0].answers
    const numAnswersPerDimension = Object.keys(dimensionDataSet).length

    this.maxQuestionareSize = this.dimensionNames.length * numAnswersPerDimension / this.repeatFactor
    if (this.questionareSize < this.maxQuestionareSize) {
      throw new Error(`INVALID_QUESTIONARE_CONFIGURATION`)
    }

    console.log(`QUESTIONARE_MAX_SIZE: ${this.maxQuestionareSize}`)
  }

  getInitialState(dimensionsDataSet) {
    let answers = []
    let dimensions = []
    let steps = {
      initialized: false,
      currentStep: 0,
      steps: []
    }
    let answerId = 0

    dimensions = dimensionsDataSet.map((dimension, indexDimension) => {
      const dimensionObject = {}
      dimensionObject['selected'] = 0
      dimensionObject['used'] = 0
      dimensionObject['id'] = indexDimension
      dimensionObject['answers'] = dimension.answers.map((answer, indexAnswer) => {
        const answerAsObject = {
          id: answerId,
          indexInDimension: indexAnswer,
          dimension: indexDimension,
          dimensionName: dimension.name,
          selected: 0,
          unselected: 0,
          answer,
        }
        answerId = answerId + 1
        answers = [...answers, answerAsObject]
        return answerAsObject
      })
      return Object.assign({}, dimension, dimensionObject)
    })

    return {
      answers,
      dimensions,
      steps,
    }
  }

  getTargetQuestions(state) {

    const firstDimensionIndex = state.steps.currentStep % state.dimensions.length
    let seccondDimensionIndex = (state.dimensions.length - 1) - firstDimensionIndex

    if (firstDimensionIndex === seccondDimensionIndex) {
      seccondDimensionIndex--
    }
    seccondDimensionIndex = seccondDimensionIndex < 0? 0 : seccondDimensionIndex

    console.log(`firstDimensionIndex: ${firstDimensionIndex}`)
    console.log(`seccondDimensionIndex: ${seccondDimensionIndex}`)

    // sortBy(this.usedDimensions, `usage`,true)


    const dimensionsSorted = sortBy(state.dimensions, `used`, true)

    const firstDimensionKey = dimensionsSorted[0].name
    const seccondDimensionKey = dimensionsSorted[1].name

    return [firstDimensionKey, seccondDimensionKey].map((dimensionKey, index) => {
      
      const filteredQuestions = state.answers.filter((answer) => {
       return !answer.selected && answer.dimensionName === dimensionKey 
      })

      return filteredQuestions[0]
    })
  }
}



export default BunchQuestionare