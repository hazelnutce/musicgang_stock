import React, { Component } from 'react'
import {RingLoader} from 'react-spinners'

export class LoaderSpinner extends Component {
  render() {
    return (
        <div className="container" style={{position: "relative", top: "50px"}}>
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
