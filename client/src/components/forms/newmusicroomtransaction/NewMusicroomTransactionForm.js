import React, { Component } from 'react'
import {Field} from 'redux-form';
import {NewMusicroomTransactionTime} from './NewMusicroomTransactionTime'
import {NewMusicroomTransactionBool} from './NewMusicroomTransactionBool'
import {NewMusicroomTransactionCheckBox} from './NewMusicroomTransactionCheckBox'

export class NewMusicroomTransactionForm extends Component {

  render() {
    return (
      <div>
        <div className="row">
          <Field
            component={NewMusicroomTransactionTime}
            name="startTime"
            placeholder="เวลาเริ่ม"
            icon="clock"
            classNameForInit="startTimePicker"
          />
          <Field
            component={NewMusicroomTransactionTime}
            name="endTime"
            placeholder="เวลาสิ้นสุด"
            icon="clock"
            classNameForInit="endTimePicker"
          />
          <div style={{position: "relative", top: "15px"}}>
            <Field 
              component={NewMusicroomTransactionBool}
              name="isOverNight"
              checkBoxLabel={"ข้ามคืน"}
              classNameForWidth={"s12 m4 l6 xl6"}
            />
          </div>
        </div>
        <div className="row" style={{position: "relative", top: "-20px"}}>
          <div>
              <Field 
                component={NewMusicroomTransactionCheckBox}
                name="roomSize"
                checkBoxLabel={"ห้องซ้อมเล็ก"}
                boxValue="Small"
              />
          </div>
          <div>
              <Field 
                component={NewMusicroomTransactionCheckBox}
                name="roomSize"
                checkBoxLabel={"ห้องซ้อมใหญ่"}
                boxValue="Large"
              />
          </div>
          <div>
            <Field 
              component={NewMusicroomTransactionBool}
              name="isStudentDiscount"
              checkBoxLabel={"ส่วนลดนักเรียน"}
              classNameForWidth={"s6 m3 l3 xl3"}
            />
          </div>
        </div>
        
      </div>
    )
  }
}

export default NewMusicroomTransactionForm
