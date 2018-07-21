import React, {Component} from 'react'
import {reduxForm, Field} from 'redux-form'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'

import Footer from './Footer'
import LoginField from './forms/LoginField';
import {loggedInUser, clearErrorAuth} from '../actions/index'

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
          {
            this.props.authError !== "" &&
              <div className="col s6 offset-s3">
                <div className="card-panel red lighten-1">
                  <span className="white-text">
                    <span><i className="material-icons" style={{marginLeft: "10px",top:"5px",position:"relative"}}>warning</i></span>
                    <a className="btn-flat right" onClick={() => this.props.clearErrorAuth(history)}><i className="close right material-icons  white-text">close</i></a>
                    <span style={{marginLeft: "10px"}}>{this.props.authError}</span>
                  </span>
                </div>
            </div>
          }
          
          <div className="card medium col s6 offset-s3">
            <div className="row">
              <form className="col s12" onSubmit={this.props.handleSubmit((values) => this.props.loggedInUser(values,history))}>
                <Field 
                component={LoginField} 
                name="username"
                type={"text"}
                icon={"account_circle"}
                keyLabel={"User Name"}/>

                <Field 
                component={LoginField}
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

function mapStateToProp(state){
  return {authError: state.authError}
}

export default reduxForm({
  form: 'login'
})(connect(mapStateToProp,{loggedInUser, clearErrorAuth})(withRouter(LoginPage)))
