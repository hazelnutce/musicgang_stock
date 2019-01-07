import React, { Component } from 'react'
import { CirclePicker } from 'react-color';

const allColor = ["#ffcdd2", "#f44336", "#c62828", "#e65100", "#ff9800", "#ffcc80", "#fff176", "#ffeb3b", "#fdd835",
                  "#e6ee9c", "#cddc39","#9e9d24", "#558b2f", "#7cb342", "#c5e1a5", "#a5d6a7", "#4caf50", "#388e3c",
                  "#b2dfdb", "#26a69a","#00897b", "#00838f", "#00bcd4", "#80deea", "#81d4fa", "#29b6f6", "#0277bd",
                  "#90caf9", "#2196f3","#1565c0", "#283593", "#3f51b5", "#9fa8da", "#b39ddb", "#7e57c2", "#512da8",
                  "#ce93d8", "#9c27b0","#6a1b9a", "#5d4037", "#795548", "#bcaaa4", "#e0e0e0", "#757575", "#212121"]

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
        <label style={{bottom: "20px", position: "relative"}}>{this.props.label}</label>
        <div style={{top: "10px", position: "relative"}}>
          <CirclePicker color={this.props.input.value} onChangeComplete={ this.handleChangeComplete } width="300" colors={allColor} circleSpacing={16} circleSize={35}/>
        </div>
      </div>
    )
  }
}

export default NewCategoryColorPicker
