import React, { Component } from 'react'
import {Field} from 'redux-form';
import NewCategoryField from './NewCategoryField'
import NewCategoryDropdown from './NewCategoryDropdown'
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
            />
            <Field
              component={NewCategoryField} 
              name="categoryNameEn"
              type={"text"}
              icon={"label"}
              keyLabel={"ชื่อภาษาอังกฤษ(EN)"}
            />
          </div>
          <div className="row">
            <Field
                component={NewCategoryDropdown}
                name="stockName"
                type={"text"}
                icon={"boxes"}
                keyLabel={"ชื่อคลังสินค้า"}
                stockName={this.props.stockName}
                faRequire={true}
              />
          </div>
          <div className="row">
            <Field
              component={NewCategoryColorPicker}
              name="labelColor"
              type={"text"}
              label={"tag"}
            />
            <Field
              component={NewCategoryColorPicker}
              name="textColor"
              type={"text"}
              label={"text"}
            />
          </div>

      </div>
    )
  }
}

export default NewCategoryForm
