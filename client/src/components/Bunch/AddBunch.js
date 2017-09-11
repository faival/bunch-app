import React from 'react'
import { connect } from 'react-redux'
import { addBunch } from '../../actions/addBunch'

let AddBunch = ({ dispatch }) => {
  let input

  return (
    <div>
      <form
        onSubmit={e => {
          e.preventDefault()
          if (!input.value.trim()) {
            return
          }
          dispatch(addBunch(input.value))
          input.value = ''
        }}
      >
        <input
          ref={node => {
            input = node
          }}
        />
        <button type="submit">
          Add Bunch
        </button>
      </form>
    </div>
  )
}
AddBunch = connect()(AddBunch)

export default AddBunch