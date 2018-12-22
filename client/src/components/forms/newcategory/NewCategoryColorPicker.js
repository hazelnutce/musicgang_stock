import React, { Component } from 'react'
import { CirclePicker } from 'react-color';

export class NewCategoryColorPicker extends Component {
  render() {
    return (
      <div className="input-field col s12 m12 l6 xl6">
        <label style={{bottom: "20px", left: "45px", position: "relative"}}>{this.props.label} background color</label>
        <div style={{top: "5px", left: "45px", position: "relative"}}>
          <CirclePicker />
        </div>
      </div>
    )
  }
}

export default NewCategoryColorPicker
