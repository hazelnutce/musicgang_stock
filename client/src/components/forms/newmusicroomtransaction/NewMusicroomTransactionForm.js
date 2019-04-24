import React, { Component } from 'react'
import {Field} from 'redux-form';
import {NewMusicroomTransactionTime} from './NewMusicroomTransactionTime'

export class NewMusicroomTransactionForm extends Component {

  render() {
    return (
      <div>
        <div className="row">
          <Field
            component={NewMusicroomTransactionTime}
            name="itemName"
            placeholder="เวลาเริ่ม"
            icon="clock"
            
          />
          <Field
            component={NewMusicroomTransactionTime}
            name="itemName2"
            placeholder="เวลาสิ้นสุด"
            icon="clock"
          />
        </div>
      </div>
    )
  }
}

export default NewMusicroomTransactionForm
