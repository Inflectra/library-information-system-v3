/*
 * NAME: Button
 * DESCRIPTION: a button with options for classes, styling, click events, and data passed in to click 
 */

import React from 'react';
import PropTypes from 'prop-types';

class Button extends React.Component {
  render() {
    let classes = `${this.props.classes} 
                   ${this.props.isSelected ? 
                     this.props.selectedClasses : this.props.nonSelectedClasses}`;
    return (
      <button 
        type="button"
        className={classes}
        disabled={this.props.isDisabled}
        onClick={() => this.props.onClick(
          this.props.value, 
          this.props.action, 
          this.props.params
        )}
        style={this.props.style}
        title={this.props.title}
        >
        {this.props.text}
      </button>
    );
  }
}

// propTypes no longer natively supported by provide useful info about the Button
Button.propTypes = {
  action: PropTypes.any, //object to pass in to click event
  classes: PropTypes.string, //default classes to use
  isDisabled: PropTypes.bool.isRequired,
  isSelected: PropTypes.bool.isRequired,
  currentValue: PropTypes.any, //the val of currently selected button - useful for button groups
  nonSelectedClasses: PropTypes.string, //any classes to use specifically when not selected
  params: PropTypes.any, //object to pass in to click event 
  selectedClasses: PropTypes.string, //classes to add if in selectd state
  style: PropTypes.object,
  text: PropTypes.node.isRequired, //text to display on the button
  value: PropTypes.any //object to pass in to click event
}

Button.defaultProps = {
  classes: 'btn btn-default',
  isDisabled: false,
  isSelected: false,
  onClick: function() {return},
  nonSelectedClasses: '',
  selectedClasses: 'is-selected'
}

export default Button;