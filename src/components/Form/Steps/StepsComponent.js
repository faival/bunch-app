import React, { Component } from 'react'
import PropTypes from 'prop-types'

import classnames from 'classnames';
import '@material/form-field/dist/mdc.form-field.css';
import '@material/checkbox/dist/mdc.checkbox.css';
import { Step, StepActive, StepCategory } from './Steps.css'

/**
NOTES:
  -webpack aliases must be provided for actions
*/

class StepsComponent extends  Component {

  componentDidMount() {
    if (!this.props.steps.initialized) {
      this.props.loadInitData()
    }
  }

  renderDimensionAnswers(stepItemId, questions) {
    return (
      <ul className="StepsList">
      {questions.map((question, index) => (
        <li className="StepItem" key={index}>
          <section className="StepSection">
            
            
              <div className={`mdc-checkbox`} onClick={() => this.props.onAnswerClick(stepItemId, question.id)}>
                <input type="checkbox" id={`${stepItemId}_${question.id}`} className={`mdc-checkbox__native-control`} />
                <div className="mdc-checkbox__background">
                  <svg className="mdc-checkbox__checkmark"
                       viewBox="0 0 24 24">
                    <path className="mdc-checkbox__checkmark__path"
                          fill="none"
                          stroke="black"
                          d="M1.73,12.91 8.1,19.28 22.79,4.59"/>
                  </svg>
                  <div className="mdc-checkbox__mixedmark"></div>
                </div>
              </div>
              <label className="StepLabel" htmlFor={`${stepItemId}_${question.id}`}>{question.answer}</label> 
          </section>
        </li>
      ))}
      </ul>
    )
  }
  
  render() {
    return(
        <div >
        {this.props.steps.steps.map((step, index) => {

          const stepClasses = classnames('mdc-form-field', 'Step', {'StepActive': (index === this.props.steps.currentStep)? true: false})

          return (
            <div key={index} className={`section-dark-theme`}>
              <section className={stepClasses}>
                {this.renderDimensionAnswers(this.props.steps.currentStep, step.questions)}
              </section>
            </div>
          )}
        )}
        </div>
      )
    }
}

StepsComponent.propTypes = {
  currentStep: PropTypes.number.isRequired,
  initialized: PropTypes.bool.isRequired,
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      questions: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          answer: PropTypes.string.isRequired,
          dimension: PropTypes.string.isRequired
        })).isRequired
    }).isRequired
  ),

  onAnswerClick: PropTypes.func.isRequired
}

export default StepsComponent