import React, { Component } from 'react'
import {RingLoader} from 'react-spinners'

export class LoaderSpinner extends Component {
  
  render() {
    let style={position: "relative", top: "50px"}
    if(this.props.doNotShift === true){
      style = {}
    }
    return (
        <div className="container" style={style}>
            <div className="row">
                <div className='col s2 offset-s6'>
                <RingLoader
                    color={this.props.color} 
                    loading={!this.props.loading} 
                />
                </div>
            </div>
        </div>
    )
  }
}

export default LoaderSpinner
