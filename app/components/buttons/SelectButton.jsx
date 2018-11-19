import React from 'react'

const SelectButton = props => {
  const fields = () => {
    let fields = []
    for (let i = 0; i < props.field.length; i++) {
      fields.push(
        <option key={i} value={`lang_${props.field[i]}`}>{props.field[i]}</option>
      )
    }
    return fields
  }

  if (props.icon) {
    return (
      <select className="select-button upper">
        {fields()}
      </select>
    )
  } else {
    return (
      <select className="select-button upper">
        {fields()}
      </select>
    )
  }
}

export default SelectButton