import React, { Component } from 'react'
import {Field} from 'redux-form';
import NewCategoryField from './NewCategoryField'
import NewCategoryColorPicker from './NewCategoryColorPicker'

export class NewCategoryForm extends Component {
  render() {
    return (
        <div className="container-fluid">
          <div className="row">
            <Field
              component={NewCategoryField} 
              name="categoryNameTh"
              type={"text"}
              icon={"label"}
              keyLabel={"ชื่อภาษาไทย(TH)"}
              mode={this.props.mode}
            />
            <Field
              component={NewCategoryField} 
              name="categoryNameEn"
              type={"text"}
              icon={"label"}
              keyLabel={"ชื่อภาษาอังกฤษ(EN)"}
              mode={this.props.mode}
            />
          </div>
          <div className="row">
            <Field
              component={NewCategoryColorPicker}
              name="labelColor"
              type={"text"}
              label={"สีของป้ายหมวดหมู่"}
            />
            <Field
              component={NewCategoryColorPicker}
              name="textColor"
              type={"text"}
              label={"สีตัวอักษรหมวดหมู่"}
            />
          </div>

      </div>
    )
  }
}

export default NewCategoryForm
