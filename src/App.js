import React, { Component } from 'react'
import { connect } from 'react-redux'
import logo from './logo.svg'
import './App.css'
import { rateBunch } from './actions/rateBunch'
import { advanceStep, getNextStep } from './actions/steps'

import normalize from 'normalize.css/normalize.css'
import '@material/typography/dist/mdc.typography.css'
import '@material/layout-grid/dist/mdc.layout-grid.css'

import BunchList from './components/Bunch/BunchList'
import AddBunch from './components/Bunch/AddBunch'

import StepsComponent from './components/Form/Steps/StepsComponent'
import GraphComponent from './components/Dimensions/GraphComponent'

import * as firebase from "firebase"

var config = {
  apiKey: "AIzaSyCDIFnitxccGTBV6JVFwChcDil9z_s8mx4",
  authDomain: "bunch-fec03.firebaseapp.com",
  databaseURL: "https://bunch-fec03.firebaseio.com",
  storageBucket: "bunch-fec03.appspot.com",
};
firebase.initializeApp(config);

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

const mapDispatchToProps = dispatch => {
  return {
    loadInitData: () => {
      dispatch(getNextStep())
    },
    onAnswerClick: (stepItemId, selected) => {

        new Promise((resolve, reject) => {
          try {
            dispatch(advanceStep({
              id: stepItemId,
              selected: selected
            }))
          } catch(err) {
            reject()
          }
          resolve()
        }).then(() => {
          dispatch(getNextStep()) 
        })
        
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



        // <VisibleBunchList />
        // <AddBunch />
class App extends Component {

  render() {
    return (
      <div className="App normalize">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Take the Tour</h2>
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

export default App;
