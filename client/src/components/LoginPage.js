import React, {Component} from 'react'
import {reduxForm, Field} from 'redux-form'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'

import Footer from './Footer'
import LoginForm from './forms/LoginForm';
import {loggedInUser} from '../actions/index'

const marginForInput = {
    marginTop: "25px",
    marginLeft: "25px"
}

export class LoginPage extends Component {

  render() {
    const {history} = this.props
    return (
      <div>
        <div className="row">
          <h4 className="header col s6 offset-s3">Login
            <i className="material-icons" style={{marginLeft: "10px"}}>input</i>
          </h4>
          <div className="card medium col s6 offset-s3">
            <div className="row">
              <form className="col s12" onSubmit={this.props.handleSubmit((values) => this.props.loggedInUser(values,history))}>
                <Field 
                component={LoginForm} 
                name="username"
                type={"text"}
                icon={"account_circle"}
                keyLabel={"User Name"}/>

                <Field 
                component={LoginForm}
                name="password"
                type={"password"}
                icon={"lock_open"}
                keyLabel={"Password"}
                />

                <div
                  className="col s6"
                  style={marginForInput}>
                  <button className="btn waves-effect waves-light" type="submit">Submit
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

export default reduxForm({
  form: 'login'
})(connect(null,{loggedInUser})(withRouter(LoginPage)))
