import React, { Component } from 'react'
import { CirclePicker } from 'react-color';

export class NewCategoryColorPicker extends Component {

  state = {
    color: ""
  }

  handleChangeComplete = (color) => {
    this.setState({color: color.hex})
    return this.props.input.onChange(color.hex)
  };

  render() {
    return (
      <div className="input-field col s12 m12 l6 xl6">
        <label style={{bottom: "20px", left: "45px", position: "relative"}}>{this.props.label} background color</label>
        <div style={{top: "5px", left: "45px", position: "relative"}}>
          <CirclePicker color={this.props.input.value} onChangeComplete={ this.handleChangeComplete }/>
        </div>
      </div>
    )
  }
}

export default NewCategoryColorPicker
