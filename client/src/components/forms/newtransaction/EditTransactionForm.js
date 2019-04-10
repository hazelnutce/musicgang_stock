import React, { Component } from 'react'
import {Field} from 'redux-form';

import { NewTransactionItem } from "./NewTransactionItem";
import { NewTransactionCounter } from './NewTransactionCounter'
import { NewTransactionField } from './NewTransactionField'
import { NewTransactionCheckbox } from './NewTransactionCheckbox'

export class EditTransactionForm extends Component {
  render() {
    const {items, editSignal, isExportMode} = this.props
    if(isExportMode){
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
                editSignal={editSignal}
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
                  editSignal={editSignal}
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
                editSignal={editSignal}
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
                  editSignal={editSignal}
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
    
  }
}

export default EditTransactionForm
