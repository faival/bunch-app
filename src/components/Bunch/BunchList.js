import React from 'react'
import PropTypes from 'prop-types'
import sortBy from '../../utils'

const List = ({ bunches, onBunchClick }) => {
  const sortedBunches = sortBy(bunches, `rate`, false)
  return (
    <ul>
      {sortedBunches.map(bunchItem => (
        <li key={bunchItem.id} onClick={() => onBunchClick(bunchItem.id)}>
          <span>{bunchItem.rate}</span>
          {bunchItem.text}
        </li>
      ))}
    </ul>
  ) 
}

List.propTypes = {
  bunches: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      text: PropTypes.string.isRequired,
      rate: PropTypes.number.isRequired,
    }).isRequired
  ).isRequired,
  onBunchClick: PropTypes.func.isRequired
}

export default List