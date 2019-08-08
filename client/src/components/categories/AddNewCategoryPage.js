import React, { Component } from 'react'
import {reduxForm, formValueSelector} from 'redux-form'
import M from 'materialize-css'
import {connect} from 'react-redux'
import ReactNotification from "react-notifications-component";

import {NewCategoryForm} from '../forms/newcategory/NewCategoryForm'
import {addCategory, resetCreateError} from '../../actions/category'
import ErrorProcessNotice from '../commons/ErrorProcessNotice'
import "react-notifications-component/dist/theme.css";

export class AddNewCategoryPage extends Component {

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
        if(this.props.editError !== prevProps.editError){
          if(this.props.editError != null){
            this.addNotification(this.props.editError)
          }
        }
      }

    componentDidMount(){
        var elems = document.querySelectorAll('select');
        M.FormSelect.init(elems, {});
        if(this.props.location.state != null){
            const localState = this.props.location.state
            const {categoryNameEn,
                categoryNameTh,
                    labelColor,
                    textColor,
                    _stockName,
                    _id} = localState

            if(localState.mode === "create"){
                this.props.initialize({
                    labelColor: "#64b5f6",
                    textColor: "#ffffff",
                    stockName: this.props.location.state.currentStock
                })
            }
            else if(localState.mode === "edit"){
                this.props.initialize({
                    labelColor,
                    textColor,
                    stockName: _stockName,
                    categoryNameEn,
                    categoryNameTh,
                    _id
                })
            }
        }
        
    }

    renderExampleTag(labelColor, textColor, categoryNameEn, categoryNameTh){
        return(
            <div className="col s12 m12 l12 xl12">
                <div className="left"> Example Tag : </div>
                <span style={{backgroundColor : labelColor, color: textColor, fontWeight: "bold"}} className="new badge left" data-badge-caption={categoryNameTh || "ตัวอย่าง"}></span>
                <span style={{backgroundColor : labelColor, color: textColor, fontWeight: "bold"}} className="new badge left" data-badge-caption={categoryNameEn || "Example"}></span>
            </div>
        )
    }

    render() {
        const {labelColor, textColor, categoryNameEn, categoryNameTh} = this.props
        if(this.props.location.state == null){
            return(
                <ErrorProcessNotice />
            )
        }
        
        else{
            var stockDisplayer = null
            const {stockName, mode, currentStock} = this.props.location.state
            if(stockName == null){
                return(
                    <ErrorProcessNotice />
                )
            }
            if(mode !== "edit" && currentStock == null){
                return(
                    <ErrorProcessNotice />
                )
            }
            if(mode !== "edit"){
                stockDisplayer = <span><i className="material-icons">arrow_forward</i> คลัง : {this.props.location.state.currentStock.toString()}</span>
            }
            return (
                <div>
                    <div className="container" style={{position: "relative", top: "5px"}}>
                        <div className="row">
                            <h5>เพิ่มหมวดหมู่สินค้า {stockDisplayer}</h5>
                        </div>
                        <div className="row" style={{position: "relative", bottom: "10px"}}>
                            <NewCategoryForm stockName={stockName} mode={this.props.location.state.mode}/>
                        </div>
                        <div className="row" style={{position: "relative", bottom: "10px"}}>
                            {this.renderExampleTag(labelColor, textColor, categoryNameEn, categoryNameTh)}
                        </div>
                        <div className="row">
                            <button onClick={this.props.handleSubmit((values) => this.props.addCategory(values, this.props.history, this.props.location.state.mode))} className="col xl2 push-xl7 l2 push-l7 m3 push-m6 s5 push-s2 green modal-close waves-effect waves-light btn" style={{marginRight: "20px"}}><i className="material-icons right">add_circle</i>Confirm</button> 
                            <div onClick={() => this.props.history.goBack()} className="col xl2 push-xl7 l2 push-l7 m3 push-m6 s5 push-s2 red modal-close waves-effect waves-light btn"><i className="material-icons right">cancel</i>Cancel</div>
                        </div>
                        <ReactNotification ref={this.notificationDOMRef} onNotificationRemoval={() => {
                            this.props.resetCreateError()
                        }} />
                    </div>
                </div>
                )
        }
        
    }
}

function validate(values){
    const errors = {}
  
    if(!values.categoryNameTh){
        errors.categoryNameTh = "กรุณาระบุหมวดหมู่ของสินค้า(ภาษาไทย)"
    }
  
    if(!values.categoryNameEn){
      errors.categoryNameEn = "กรุณาระบุหมวดหมู่ของสินค้า(ภาษาอังกฤษ)"
    }

    return errors
  }

AddNewCategoryPage = reduxForm({
    form : 'newCategoryForm',
    validate
  })(AddNewCategoryPage)

  const selector = formValueSelector('newCategoryForm')

  AddNewCategoryPage = connect(
      state => {
          // can select values individually
        const labelColor = selector(state, 'labelColor')
        const textColor = selector(state, 'textColor')
        const categoryNameTh = selector(state, 'categoryNameTh')
        const categoryNameEn = selector(state, 'categoryNameEn')
        return {
            labelColor,
            textColor,
            categoryNameTh,
            categoryNameEn,
            editError: state.category.errorMessage
        }
      }, {addCategory, resetCreateError}
  )(AddNewCategoryPage)

export default AddNewCategoryPage


