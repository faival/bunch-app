import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import logo from './logo.svg'
import './App.css'
import { rateBunch } from './actions/rateBunch'
import { initialDataFetched, advanceStep, startQuestionare, stopQuestionare, getInitialStep, getNextStep, initFetchData, finishFetchData } from './actions/steps'
import { getInitialData, pushParticipantData } from './api/BunchApi'

import normalize from 'normalize.css/normalize.css'
import '@material/typography/dist/mdc.typography.css'
import '@material/layout-grid/dist/mdc.layout-grid.css'
import '@material/linear-progress/dist/mdc.linear-progress.css'

import BunchList from './components/Bunch/BunchList'
import AddBunch from './components/Bunch/AddBunch'

import StepsComponent from './components/Form/Steps/StepsComponent'
import GraphComponent from './components/Dimensions/GraphComponent'

const getBunchItems = (bunches, filter) => {
  switch(filter) {
    case `SHOW_ALL`:
      return bunches
    case `SHOW_GOOD`:
      return bunches.filter(b => (b.rate > 0.5))
    case `SHOW_BAD`:
      return bunches.filter(b => (b.rate <= 0.5))
  }
}

const mapStateToProps = (state) => {
  return {steps: state.questionare.steps }
}

const mapStateToPropsApp = (state) => {
  return {
    currentStep: state.questionare.steps.currentStep,
    agreed: state.questionare.steps.agreed,
    completed: state.questionare.steps.completed
  }
}

const mapStateToPropsDimensions = (state) => {  
  return {
    dimensions: state.questionare.dimensions.sort((item, nextItem) => item.selected - nextItem.selected < 0)
  }
}

const mapStateToPropsBunches = state => {
  return {
    bunches: getBunchItems(state.bunches, state.visibilityFilter),
  }
}

const mapDispatchToPropsBunches = dispatch => {
  return {
    onBunchClick: id => {
      dispatch(rateBunch(id))
    },
  }
}

const mapDispatchToProps = (dispatch, state) => {
  return {
    loadInitData: () => {
      return new Promise((resolve, reject) => {
        getInitialData((data) => {
              resolve(data)
          })
        }).then((data) => {
          return new Promise((resolve, reject) => {
            dispatch(initialDataFetched(data))
            resolve()  
          }).then(() => dispatch(getInitialStep()))
        })
    },
    onAgreedClick: (inputId) => {
      const nameValue = document.getElementById(inputId).value
      dispatch(startQuestionare(nameValue))
    },
    onCompletedClick: (state) => {
      pushParticipantData(() => {
        dispatch(stopQuestionare())
      }, state)
    },
    onAnswerClick: (stepItemId, selected) => {
    
        new Promise((resolve, reject) => {
          setTimeout(() => {
            dispatch(initFetchData())
            resolve()
          }, 300)
        }).then(() => new Promise((resolve, reject) => {
          try {
            dispatch(advanceStep({
              id: stepItemId,
              selected: selected
            }))
          } catch(err) {
            console.log(err)
            reject()
          }
          resolve()
        })).then(() => new Promise((resolve, reject) => {
          setTimeout(() => {
            dispatch(getNextStep()) 
            resolve()
          }, 300)
        })).then(() => dispatch(finishFetchData()))
    },
  }
}

const VisibleBunchList = connect(
  mapStateToPropsBunches,
  mapDispatchToPropsBunches
)(BunchList)

const BunchQuestionare = connect(
  mapStateToProps,
  mapDispatchToProps
)(StepsComponent)


const DimensionsGraph = connect(
  mapStateToPropsDimensions
  )(GraphComponent)


class App extends Component {

  render() {
    let title = this.props.agreed && !this.props.completed? `Question: ${this.props.currentStep + 1} / 30` : `Bunch.io Questionare`

    title = this.props.completed? 'Completed!' : title
    
    return (
      <div className="App normalize">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>{title}</h2>
        </div>

        <div className="mdc-layout-grid">
          <div className="mdc-layout-grid__inner">
            <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
              <BunchQuestionare/>
            </div>
            <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
              <DimensionsGraph />
            </div>
          </div>
        </div>
        <p className="App-intro">
        </p>
      </div>
    );
  }
}

App.propTypes = {
  currentStep: PropTypes.number.isRequired,
  agreed: PropTypes.bool.isRequired
}


export default connect(mapStateToPropsApp)(App);
