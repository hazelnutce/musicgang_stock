import React, { Component } from 'react'
import {Field} from 'redux-form';
import NewStockField from './NewStockField'

export class NewStockForm extends Component {
  render() {
    return (
      <div>
        <Field
            component={NewStockField} 
            name="stockName"
            type={"text"}
            icon={"assignment"}
            keyLabel={"ชื่อคลังสินค้า"}
        />

        <Field
            component={NewStockField}
            name="description"
            type={"text"}
            icon={"description"}
            keyLabel={"คำจำกัดความของคลังสินค้า"}
        />
      </div>
    )
  }
}

export default NewStockForm
