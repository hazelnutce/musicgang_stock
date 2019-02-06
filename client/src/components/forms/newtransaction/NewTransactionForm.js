import React, { Component } from 'react'
import {Field} from 'redux-form';

import { NewTransactionItem } from "./NewTransactionItem";
import { NewTransactionCounter } from './NewTransactionCounter'
import { NewTransactionField } from './NewTransactionField'

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
            keyLabel={"จำนวนสินค้า : "}
          />
        </div>
        <div className="row">
          <Field 
              component={NewTransactionField}
              name="discount"
              type={"number"}
              icon={"dollar-sign"}
              keyLabel={"ส่วนลดเพิ่มเติม (บาท)"}
              haveCheckBox={true}
              checkBoxLabel={"ส่วนลดเพิ่มเติม"}
          />
          </div>
          <div className="row" style={{marginTop: "-20px"}}>
            <Field 
                component={NewTransactionField}
                name="overcost"
                type={"number"}
                icon={"dollar-sign"}
                keyLabel={"สว่นคิดเงินเกิน (บาท)"}
                haveCheckBox={true}
                checkBoxLabel={"คิดเงินเกิน"}
            />
          </div>
      </div>
    )
  }
}

export default NewTransactionForm
