import React, { Component } from 'react'
import {Field} from 'redux-form';
import {ErrorProcessNotice} from '../../commons/ErrorProcessNotice'

import { NewTransactionItem } from "./NewTransactionItem";
import { NewTransactionCounter } from './NewTransactionCounter'
import { NewTransactionField } from './NewTransactionField'
import { NewTransactionCheckbox} from './NewTransactionCheckbox'

export class NewTransactionForm extends Component {
  
  render() {
    const {items, mode, resetSignal} = this.props
    if(mode === "Import"){
      return (
        <div>
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
                type={"text"}
                icon={"dollar-sign"}
                keyLabel={"ส่วนลดเพิ่มเติม (บาท)"}
                haveCheckBox={true}
                checkBoxLabel={"ส่วนลดเพิ่มเติม"}
                resetSignal={resetSignal}
                normalize={(val, prevVal) => {
                  if (val) {
                    return (/^\d+\.{0,1}\d{0,2}$/.test(val)) ? val : prevVal
                  }
                  return val;
                }}
                inputmode="numeric"
            />
            </div>
            <div className="row" style={{marginTop: "-15px"}}>
              <Field 
                  component={NewTransactionField}
                  name="overcost"
                  type={"text"}
                  icon={"dollar-sign"}
                  keyLabel={"ส่วนคิดเงินเกิน (บาท)"}
                  haveCheckBox={true}
                  checkBoxLabel={"คิดเงินเกิน"}
                  resetSignal={resetSignal}
                  normalize={(val, prevVal) => {
                    if (val) {
                      return (/^\d+\.{0,1}\d{0,2}$/.test(val)) ? val : prevVal
                    }
                    return val;
                  }}
                  inputmode="numeric"
              />
            </div>
        </div> 
      )
    }
    else if(mode === "Export"){
      return (
        <div>
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
                type={"text"}
                icon={"dollar-sign"}
                keyLabel={"ส่วนลดเพิ่มเติม (บาท)"}
                haveCheckBox={true}
                checkBoxLabel={"ส่วนลดเพิ่มเติม"}
                resetSignal={resetSignal}
                normalize={(val, prevVal) => {
                  if (val) {
                    return (/^\d+\.{0,1}\d{0,2}$/.test(val)) ? val : prevVal
                  }
                  return val;
                }}
                inputmode="numeric"
            />
            </div>
            <div className="row" style={{marginTop: "-15px"}}>
              <Field 
                  component={NewTransactionField}
                  name="overcost"
                  type={"text"}
                  icon={"dollar-sign"}
                  keyLabel={"ส่วนคิดเงินเกิน (บาท)"}
                  haveCheckBox={true}
                  checkBoxLabel={"คิดเงินเกิน"}
                  resetSignal={resetSignal}
                  normalize={(val, prevVal) => {
                    if (val) {
                      return (/^\d+\.{0,1}\d{0,2}$/.test(val)) ? val : prevVal
                    }
                    return val;
                  }}
                  inputmode="numeric"
              />
            </div>
            <div className="row" style={{marginTop: "-15px"}}>
              <Field 
                  component={NewTransactionCheckbox}
                  name="isUsedInMusicGang"
                  checkBoxLabel={"ใช้ในห้องซ้อม (ฟรี)"}
              />
            </div>
        </div> 
      )
    }
    else{
      return(
        <ErrorProcessNotice />
      )
    }
    
  }
}

export default NewTransactionForm
