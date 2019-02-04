import React, { Component } from 'react'
import {Field} from 'redux-form';

import { NewTransactionItem } from "./NewTransactionItem";
import { NewTransactionCounter } from './NewTransactionCounter'

export class NewTransactionForm extends Component {
  render() {
    const {items} = this.props
    return (
      <div className="container-fluid">
        <div className="row">
          <Field
            component={NewTransactionItem}
            name="itemName"
            type={"text"}
            icon={"tag"}
            keyLabel={"สินค้า"}
            items={items}
          />
          <Field
            component={NewTransactionCounter}
            name="itemAmount"
          />
        </div>
      </div>
    )
  }
}

export default NewTransactionForm
