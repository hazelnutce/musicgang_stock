import React, { Component } from 'react'
import {Field} from 'redux-form';
import NewCategoryField from './NewCategoryField'
import NewCategoryDropdown from './NewCategoryDropdown'

export class NewCategoryForm extends Component {
  render() {
    return (
        <div>
        <Field
            component={NewCategoryField} 
            name="categoryName"
            type={"text"}
            icon={"label"}
            keyLabel={"Category Name"}
        />

        <Field 
            component={NewCategoryDropdown}
            name="stockSelector"
        />
        
      </div>
    )
  }
}

export default NewCategoryForm
