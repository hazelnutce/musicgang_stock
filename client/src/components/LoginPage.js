import React, {Component} from 'react'
import {reduxForm} from 'redux-form'

import Footer from './Footer'

const marginForInput = {
    marginTop: "25px",
    marginLeft: "25px"
}

export class LoginPage extends Component {
  render() {
    return (
      <div>
        <div className="row">
          <h4 class="header col s6 offset-s3">Login
            <i class="material-icons" style={{marginLeft: "10px"}}>input</i>
          </h4>
          <div className="card medium col s6 offset-s3">
            <div className="row">
              <form className="col s12">
                <div
                  className="input-field col s8"
                  style={marginForInput}>
                  <i class="material-icons prefix">account_circle</i>
                  <input id="user_name" type="text" className="validate"/>
                  <label for="user_name">User Name</label>
                </div>
                <div
                  className="input-field col s8"
                  style={marginForInput}>
                  <i class="material-icons prefix">lock_open</i>
                  <input id="password" type="password" className="validate"/>
                  <label for="password">Password</label>
                </div>
                <div
                  className="col s6"
                  style={{
                  marginTop: "25px",
                  marginLeft: "25px"
                }}>
                  <button className="btn waves-effect waves-light" type="submit" name="action">Submit
                    <i className="material-icons right">send</i>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <Footer />
      </div>

    )
  }
}

LoginPage = reduxForm({
  form: 'login'
})(LoginPage)

export default LoginPage
