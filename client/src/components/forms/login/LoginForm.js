import React, { Component } from 'react'
import LoginField from './LoginField';
import {Field} from 'redux-form';

export class LoginForm extends Component {
  render() {
    return (
      <div>
        <Field 
            component={LoginField} 
            name="username"
            type={"text"}
            icon={"account_circle"}
            keyLabel={"User Name"}
        />

        <Field 
            component={LoginField}
            name="password"
            type={"password"}
            icon={"lock_open"}
            keyLabel={"Password"}
        />
      </div>
    )
  }
}

export default LoginForm
