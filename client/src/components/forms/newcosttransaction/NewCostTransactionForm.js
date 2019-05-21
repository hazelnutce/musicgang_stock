import React, { Component } from 'react'
import {Field} from 'redux-form';

import NewCostTransactionField from './NewCostTransactionField';
import NewCostTransactionCheckBox from './NewCostTransactionCheckBox'

export class NewCostTransactionForm extends Component {
  render() {
    return (
      <div className="row">
        <Field 
              component={NewCostTransactionField}
              name="description"
              type={"text"}
              icon={"info"}
              keyLabel={"คำอธิบายรายการ"}
          />
          <Field 
              component={NewCostTransactionField}
              name="cost"
              type={"number"}
              icon={"dollar-sign"}
              keyLabel={"จำนวนเงิน"}
              normalize={(val, prevVal) => {
                if (val) {
                  return (/^\d+\.{0,1}\d{0,2}$/.test(val)) ? val : prevVal
                }
                return val;
              }}
              inputmode="numeric"
          />
          <div style={{top: "10px", position: "relative"}}>
              <Field 
                component={NewCostTransactionCheckBox}
                name="costType"
                checkBoxLabel={"รายรับ"}
                boxValue="Small"
              />
          </div>
          <div style={{top: "10px", position: "relative"}}>
              <Field 
                component={NewCostTransactionCheckBox}
                name="costType"
                checkBoxLabel={"รายจ่าย"}
                boxValue="Large"
              />
          </div>
          {this.props.children}
      </div>
    )
  }
}

export default NewCostTransactionForm
