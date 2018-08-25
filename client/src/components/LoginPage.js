import React, {Component} from 'react'
import {reduxForm} from 'redux-form'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'

import Footer from './Footer'
import {loggedInUser, clearErrorAuth} from '../actions'
import LoginForm from './forms/login/LoginForm';
import {ErrorFormNotification} from './commons/ErrorFormNotification'

const marginForInput = {
    marginTop: "25px",
    marginLeft: "25px"
}

export class LoginPage extends Component {

  render() {
    const {history} = this.props
    return (
      <div className="container">
        <div className="row">
            <h4 className="header col s6 offset-s3">Login
              <i className="material-icons" style={{marginLeft: "10px"}}>input</i>
            </h4>
          {
            this.props.authError !== "" &&
              <ErrorFormNotification errorMessage={this.props.authError} clearErrorMessage={this.props.clearErrorAuth} specificColumn="col s6 offset-s3"/>
          }
          
          <div className="card medium col s6 offset-s3">
            <div className="row">
              <form className="col s12" onSubmit={this.props.handleSubmit((values) => this.props.loggedInUser(values,history))}>
                <LoginForm />
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

function mapStateToProp(state){
  return {authError: state.authError}
}

export default reduxForm({
  form: 'login'
})(connect(mapStateToProp,{loggedInUser, clearErrorAuth})(withRouter(LoginPage)))
