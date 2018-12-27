import React, { Component } from 'react'
import {reduxForm, formValueSelector} from 'redux-form'
import {Link} from 'react-router-dom'
import M from 'materialize-css'
import {connect} from 'react-redux'

import {NewCategoryForm} from '../forms/newcategory/NewCategoryForm'
import {addCategory} from '../../actions/category'
import ErrorProcessNotice from '../commons/ErrorProcessNotice'

export class AddNewCategoryPage extends Component {

    componentDidMount(){
        var elems = document.querySelectorAll('select');
        M.FormSelect.init(elems, {});
        this.props.initialize({
            labelColor: "#64b5f6",
            textColor: "#ffffff",
            stockName: this.props.location.state != null ? this.props.location.state.stockName[0] : null
        })
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
            const {stockName} = this.props.location.state
            if(stockName == null){
                return(
                    <ErrorProcessNotice />
                )
            }
            return (
                <div>
                    <div className="container" style={{position: "relative", top: "5px"}}>
                        <div className="row">
                            <h5>เพิ่มหมวดหมู่สินค้า</h5>
                        </div>
                        <div className="row" style={{position: "relative", bottom: "10px"}}>
                            <NewCategoryForm stockName={stockName}/>
                        </div>
                        <div className="row" style={{position: "relative", bottom: "10px"}}>
                            {this.renderExampleTag(labelColor, textColor, categoryNameEn, categoryNameTh)}
                        </div>
                        <div className="row">
                            <button onClick={this.props.handleSubmit((values) => this.props.addCategory(values, stockName))} className="col xl2 push-xl7 l2 push-l7 m3 push-m6 s5 push-s2 green modal-close waves-effect waves-light btn" style={{marginRight: "20px"}}><i className="material-icons right">add_circle</i>Confirm</button> 
                            <Link to="/categories" className="col xl2 push-xl7 l2 push-l7 m3 push-m6 s5 push-s2 red modal-close waves-effect waves-light btn"><i className="material-icons right">cancel</i>Cancel</Link>
                        </div>
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
            categoryNameEn
        }
      }, {addCategory}
  )(AddNewCategoryPage)

export default AddNewCategoryPage


