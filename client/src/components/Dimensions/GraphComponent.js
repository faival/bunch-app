import React from 'react'
import findDOMNode from 'react-dom'
import PropTypes from 'prop-types'
import { Graph, GraphRate, GraphSection } from './Graph.css'
import { PieChart } from 'react-d3-basic'

const GraphComponent = ({ dimensions }) => {
  const minDeviceWidth = 500
  const width = 350
  const height = 275
  const colors = [`#E91E63`, `#9C27B0`, `#3F51B5`, `#8BC34A`, `#FFC107`, `#F44336`]


  const renderPie = (dimensions) => {
    let dimensionsData = []
    dimensionsData = dimensions.map((dimension, index) => {
      return { name: dimensions[index].name, field: dimensions[index].name, value: dimensions[index].selected + 1 }
    })

    const dimensionValue = (d)=> {
      return d.value
    }

    const dimensionName = (d)=> {
      return d.name
    }

    const dimensionSeries = dimensionsData.map((dimension,index ) => Object.assign({}, dimension, {color: colors[index]}))

    const pieMargins = { top: 0, right: 100, bottom: 0, left: 100}

    return (
      <PieChart
          width= {width}
          height= {height}
          margins= {pieMargins}
          data= {dimensionsData}
          radius= {width / 3 - 50}
          chartSeries= {dimensionSeries}
          outerRadius={(width / 3 - 55)}
          value = {dimensionValue}
          name = {dimensionName}
          showLegend={false}
          legendPosition='right'
        />
    )
  }
  
  return renderPie(dimensions)
}

GraphComponent.propTypes = {
  dimensions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      selected: PropTypes.number.isRequired,
      used: PropTypes.number.isRequired
    }).isRequired
  ),
}

export default GraphComponent