import React, { Component } from 'react'
import {Field} from 'redux-form';
import {ErrorProcessNotice} from '../../commons/ErrorProcessNotice'

import { NewTransactionItem } from "./NewTransactionItem";
import { NewTransactionCounter } from './NewTransactionCounter'
import { NewTransactionField } from './NewTransactionField'
import { NewTransactionCheckbox} from './NewTransactionCheckbox'

export class NewTransactionForm extends Component {
  
  render() {
    const {items, mode} = this.props
    
    if(mode === "In"){
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
                type={"number"}
                icon={"dollar-sign"}
                keyLabel={"ส่วนลดเพิ่มเติม (บาท)"}
                haveCheckBox={true}
                checkBoxLabel={"ส่วนลดเพิ่มเติม"}
            />
            </div>
            <div className="row" style={{marginTop: "-15px"}}>
              <Field 
                  component={NewTransactionField}
                  name="overcost"
                  type={"number"}
                  icon={"dollar-sign"}
                  keyLabel={"ส่วนคิดเงินเกิน (บาท)"}
                  haveCheckBox={true}
                  checkBoxLabel={"คิดเงินเกิน"}
              />
            </div>
        </div> 
      )
    }
    else if(mode === "Out"){
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
                type={"number"}
                icon={"dollar-sign"}
                keyLabel={"ส่วนลดเพิ่มเติม (บาท)"}
                haveCheckBox={true}
                checkBoxLabel={"ส่วนลดเพิ่มเติม"}
            />
            </div>
            <div className="row" style={{marginTop: "-15px"}}>
              <Field 
                  component={NewTransactionField}
                  name="overcost"
                  type={"number"}
                  icon={"dollar-sign"}
                  keyLabel={"ส่วนคิดเงินเกิน (บาท)"}
                  haveCheckBox={true}
                  checkBoxLabel={"คิดเงินเกิน"}
              />
            </div>
            <div className="row" style={{marginTop: "-15px"}}>
              <Field 
                  component={NewTransactionCheckbox}
                  name="discountBy5"
                  checkBoxLabel={"ลด 5 เปอร์เซ็นต์"}
              />
            </div>
            <div className="row" style={{marginTop: "-15px"}}>
              <Field 
                  component={NewTransactionCheckbox}
                  name="discountBy10"
                  checkBoxLabel={"ลด 10 เปอร์เซ็นต์"}
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
