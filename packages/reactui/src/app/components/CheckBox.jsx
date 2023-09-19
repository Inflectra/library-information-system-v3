/*
 * NAME: Select
 * DESCRIPTION: checkbox - styled as Bootstrap 
 */

import React from 'react'

const CheckBox = (props) => {
  return (
    <div className="form-check form-switch">
        <input
            type="checkbox" 
            className="form-check-input" 
            id={props.id}
            name={props.id}
            onChange={props.onChange}
        />
        <label className="form-check-label" htmlFor={props.id}>{props.label}</label>
    </div>
  )
}

export default CheckBox