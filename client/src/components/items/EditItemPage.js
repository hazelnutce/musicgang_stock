import React, { Component } from 'react'
import EditItemForm from '../forms/newitem/EditItemForm'
import { reduxForm } from 'redux-form'
import { connect } from 'react-redux'
import {Link} from 'react-router-dom'
import ReactNotification from "react-notifications-component";

import {fetchCategory, fetchItem, editItem, resetEditError} from '../../actions/item'
import "react-notifications-component/dist/theme.css";

export class EditItemPage extends Component {
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

  componentDidMount(){
    const {itemName, category, cost, revenue, itemWarning, itemRemaining} = this.props.location.state
    this.props.fetchCategory()
    this.props.initialize({
      itemName,
      category,
      cost,
      income : revenue,
      itemWarning,
      initialItem: itemRemaining,
      isCreateTransaction: false
    })
  }

  componentDidUpdate(prevProps){
    if(this.props.editError !== prevProps.editError){
      if(this.props.editError != null){
        this.addNotification(this.props.editError)
      }
    }
  }

  render() {
    const {category, handleSubmit, history} = this.props
    const {stockId, stockName} = this.props.location.state
    var currentLocation = this.props.location.pathname.toString()
    var itemId = currentLocation.replace("/items/edit/", "")
    return (
        <div className="container" style={{position: "relative", top: "5px"}}>
            <div className="row">
                <h5 className="col s12"><i className="material-icons">edit</i><span style={{marginLeft: "20px"}}>แก้ไขสินค้า / คลัง : {stockName}</span></h5>
            </div>
            <div className="row" style={{position: "relative", bottom: "10px"}}>
              <EditItemForm category={category} stockName={stockName}/>
            </div>
            <div className="row">
              <button onClick={handleSubmit((values) => this.props.editItem(values, itemId, stockId, stockName, history))} className="col xl2 push-xl7 l2 push-l7 m3 push-m6 s5 push-s2 green modal-close waves-effect waves-light btn" style={{marginRight: "20px"}}><i className="material-icons right">add_circle</i>ยืนยัน</button> 
              <Link to={{ state: {stockName}, pathname: `/items/${stockId}`}} className="col xl2 push-xl7 l2 push-l7 m3 push-m6 s5 push-s2 red modal-close waves-effect waves-light btn"><i className="material-icons right">cancel</i>ยกเลิก</Link>
            </div>
            <ReactNotification ref={this.notificationDOMRef} onNotificationRemoval={() => {
              this.props.resetEditError()
            }} />
      </div>
    )
  }
}

function mapStateToProps(state){
  return {category: state.category, editError: state.item.errorEditMessage}
}

export default reduxForm({
  form : 'EditItemPage',
})(connect(mapStateToProps, {fetchCategory, fetchItem, editItem, resetEditError})(EditItemPage))
