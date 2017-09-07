import { combineReducers } from 'redux'
import bunches from './bunches'
import questionare from './questionare'
import visibilityFilter from './visibilityFilter'

const bunchApp = combineReducers({
    questionare,
    bunches, 
    visibilityFilter
})

export default bunchApp
