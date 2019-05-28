import React, { Component } from 'react'
import {Field} from 'redux-form';

import NewCostTransactionField from './NewCostTransactionField';
import NewCostTransactionCheckBox from './NewCostTransactionCheckBox'

export class NewCostTransactionForm extends Component {
  render() {
    return (
      <div>
      <div className="row">
        {this.props.children}
      </div>
      <div className="row" style={{bottom: "30px", position: "relative"}}>
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
              type={"text"}
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
        </div>
        <div className="row">
          <div style={{top: "-35px", position: "relative"}}>
              <Field 
                component={NewCostTransactionCheckBox}
                name="costType"
                checkBoxLabel={"รายจ่าย"}
                boxValue="Cost"
              />
          </div>
          <div style={{top: "-35px", position: "relative"}}>
              <Field 
                component={NewCostTransactionCheckBox}
                name="costType"
                checkBoxLabel={"รายรับ"}
                boxValue="Revenue"
              />
          </div>
        </div>
      </div>
     
    )
  }
}

export default NewCostTransactionForm
