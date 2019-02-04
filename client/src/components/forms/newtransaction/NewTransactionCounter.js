import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export class NewTransactionCounter extends Component {
  render() {
    return (
        <div className="input-field col s12 m6 l6 xl6">
            <span style={{padding: "20px"}}><FontAwesomeIcon className="fa-2x" icon="plus-square"/></span>
            <span style={{fontSize: "24px"}}>1</span>
            <span style={{padding: "20px"}}><FontAwesomeIcon className="fa-2x" icon="minus-square"/></span>
        </div>
    )
  }
}

export default NewTransactionCounter
