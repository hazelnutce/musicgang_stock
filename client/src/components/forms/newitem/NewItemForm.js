import React, { Component } from 'react'
import NewItemField from './NewItemField';
import {Field} from 'redux-form';

export class NewItemForm extends Component {
  render() {
    return (
      <div>
        <Field 
            component={NewItemField} 
            name="username"
            type={"text"}
            icon={"account_circle"}
            keyLabel={"User Name"}
        />

        <Field 
            component={NewItemField}
            name="password"
            type={"password"}
            icon={"lock_open"}
            keyLabel={"Password"}
        />
      </div>
    )
  }
}

export default NewItemForm