import React, { Component } from 'react'
import PropTypes from 'prop-types'

import classnames from 'classnames';
import '@material/linear-progress/dist/mdc.linear-progress.css';
import '@material/form-field/dist/mdc.form-field.css';
import '@material/textfield/dist/mdc.textfield.css';
import '@material/textfield/dist/mdc.textfield.js';
import '@material/checkbox/dist/mdc.checkbox.css';

import '@material/dialog/dist/mdc.dialog.css';
import '@material/button/dist/mdc.button.css';

import { Step, StepActive, StepCategory, StepsList, StepsListActive, StepsSplash, StepsSplashActive, StepsProgress } from './Steps.css'

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

    const stepsClass = classnames(
      'StepsList',
      {'StepsListActive': this.props.steps.agreed && !this.props.steps.completed})

    const splashClass = classnames(
      'StepsSplash',
      {'StepsSplashActive': !this.props.steps.agreed})

    return (
      <div className='Questionare'>
        <section className={splashClass}>
          <aside className="catalog-dialog-demo mdc-dialog mdc-dialog--open">
            <div className="mdc-dialog__surface">
              <header className="mdc-dialog__header">
                <h2 className="mdc-dialog__header__title">
                  Ready to know more about you?
                </h2>
              </header>
              <section className="mdc-dialog__body">
                <div className="mdc-textfield">
                  <input type="text" id="questionare-participant" className="mdc-textfield__input" placeholder="What's your name?" />
                </div>
              </section>
              <footer className="mdc-dialog__footer">
                <button type="button" 
                  className="mdc-button mdc-dialog__footer__button mdc-dialog__footer__button--accept" 
                  onClick={() => this.props.onAgreedClick('questionare-participant')}>Continue</button>
              </footer>
            </div>
          </aside>
        </section>
        

        <ul className={stepsClass}>
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
      </div>
    )
  }
  
  render() {

    const completed = this.props.steps.completed
    const fetching = this.props.steps.fetching
    const pushed = this.props.steps.pushed
    const name = this.props.steps.name

    const participantData = completed? Object.assign({}, {steps: this.props.steps}) : {}

    const progressbarClass = classnames(
      'mdc-linear-progress', 
      {'mdc-linear-progress--indeterminate': fetching })

    const renderFetching = (fetching) => {

      if (!fetching) {
        return (<div></div>)
      }
      return (
        <div className='StepsProgress'>
          <div role="progressbar" className={progressbarClass}>
            <div className="mdc-linear-progress__buffering-dots"></div>
              <div className="mdc-linear-progress__buffer"></div>
            <div className="mdc-linear-progress__bar mdc-linear-progress__primary-bar">
              <span className="mdc-linear-progress__bar-inner"></span>
            </div>
            <div className="mdc-linear-progress__bar mdc-linear-progress__secondary-bar">
              <span className="mdc-linear-progress__bar-inner"></span>
            </div>
          </div>
        </div>
      )
    }

    const renderCompleted = (completed, pushed, name) => {

      const statsHeader = `Stats for user ${name}...`

      if (!completed) {
        return (<div></div>)
      } else if (completed && pushed) {
        return (<h3>{statsHeader}</h3>)
      }

      const completedClass = classnames('StepsCompleted')

      return (
        <section className={completedClass}>
          <aside className="catalog-dialog-demo mdc-dialog mdc-dialog--open">
            <div className="mdc-dialog__surface">
              <header className="mdc-dialog__header">
                <h2 className="mdc-dialog__header__title">
                  Thanks for your time!
                </h2>
              </header>
              <section className="mdc-dialog__body">
                Your information will be safe with us!
              </section>
              <footer className="mdc-dialog__footer">
                <button type="button" 
                  className="mdc-button mdc-dialog__footer__button mdc-dialog__footer__button--accept" 
                  onClick={() => this.props.onCompletedClick(participantData)}>Great!</button>
              </footer>
            </div>
          </aside>
        </section>
      )
    }

    return (
      <div>
      {this.props.steps.steps.map((step, index) => {
        const stepClasses = classnames('mdc-form-field', 'Step', {'StepActive': (index === this.props.steps.currentStep)? true: false})
        return (
          <div key={index} className={`section-dark-theme`}>
            <section className={stepClasses}>
              {this.renderDimensionAnswers(this.props.steps.currentStep, step.questions)}
            </section>
          </div>
        )})
      }
      {
        renderFetching(fetching)
      }
      {
        renderCompleted(completed, pushed, name)
      }
      </div>
    )
  }
}

StepsComponent.propTypes = {
  currentStep: PropTypes.number.isRequired,
  initialized: PropTypes.bool.isRequired,
  agreed: PropTypes.bool.isRequired,
  fetching: PropTypes.bool.isRequired,
  pushed: PropTypes.bool.isRequired,
  completeted: PropTypes.bool.isRequired,
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