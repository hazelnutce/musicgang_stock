import React, {Component} from 'react'
import {reduxForm} from 'redux-form'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import ReactNotification from "react-notifications-component";

import Footer from './Footer'
import {loggedInUser, clearErrorAuth} from '../actions'
import LoginForm from './forms/login/LoginForm';
import "react-notifications-component/dist/theme.css";

const marginForInput = {
    marginTop: "25px",
    marginLeft: "25px"
}

export class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.notificationDOMRef = React.createRef();
  }

  addNotification = (message) => {
    this.notificationDOMRef.current.addNotification({
      title: "ข้อผิดพลาด",
      message: message,
      type: "danger",
      insert: "buttom",
      container: "top-right",
      animationIn: ["animated", "fadeIn"],
      animationOut: ["animated", "fadeOut"],
      dismiss: { duration: 2000 },
      dismissable: { click: true }
    });
  } 

  componentDidUpdate(prevProps){
    if(this.props.authError !== prevProps.authError){
      if(this.props.authError != null){
        this.addNotification(this.props.authError)
      }
    }
  }

  render() {
    const {history} = this.props
    return (
      <div className="container">
        <div className="row">
            <h4 className="header col s6 offset-s3">เข้าสู่ระบบ
              <i className="material-icons" style={{marginLeft: "10px"}}>input</i>
            </h4>       
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
        <ReactNotification ref={this.notificationDOMRef} onNotificationRemoval={() => {
              this.props.clearErrorAuth()
        }} />
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
