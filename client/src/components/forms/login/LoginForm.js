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
            keyLabel={"ชื่อผู้ใช้งาน"}
        />

        <Field 
            component={LoginField}
            name="password"
            type={"password"}
            icon={"lock_open"}
            keyLabel={"รหัสผ่าน"}
        />
      </div>
    )
  }
}

export default LoginForm
