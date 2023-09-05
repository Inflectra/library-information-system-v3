/*
 * NAME: Select
 * DESCRIPTION: a select form component with simple options to manage chosen value - styled as Bootstrap 
 */

 import React from 'react'

const Select = (props) => {
  const options = props.options.map(option => (
    <option 
      key={option.id} 
      value={option.id}
      >
      {option.name}
    </option> 
  ));
  return (
    <select 
      className="form-control" 
      name={props.name} 
      value={props.selected}
      onChange={props.onChange}
      >
      {options}
    </select>
  )
}

export default Select