import React, { Component } from 'react'
import {Field} from 'redux-form';
import _ from 'lodash'

import NewItemField from './NewItemField';
import {LoaderSpinner} from '../../commons/LoaderSpinner'
import {NewItemCheckbox} from './NewItemCheckbox'
import {NewItemCheckboxBoolean} from './NewItemCheckboxBoolean'
import {Link} from 'react-router-dom'

export class EditItemForm extends Component {
    constructor(props){
        super(props)

        this.state = {
            loadingCategory: false
        }
    }

    renderCategory(categories){
        var query = (categories.filter((item) => item.stockName === this.props.stockName))
    
        return _.map(query, category => {
          return (
            <Field 
              key={category._id}
              component={NewItemCheckbox}
              name="category"
              checkBoxLabel={category.categoryNameTh}
              boxValue={category.categoryNameTh}
              labelColor={category.labelColor}
              textColor={category.textColor}
            />
    
          )
        })
      }
    
    componentDidUpdate(prevProps){
        if(prevProps.category.categories !== this.props.category.categories){
          this.setState({loadingCategory : true})
        }
    }

    flattenObject(categorys){
        var query = (categorys.filter((item) => item.stockName === this.props.stockName))
        var allCategoryName =  query.map(x => (({ categoryNameTh, categoryNameEn }) => ({categoryNameTh, categoryNameEn}))(x))
        return allCategoryName
      }

  render() {
    return (
      <div className="container-fluid">
        <div className="row">
            <h6>- รายละเอียดสินค้า</h6>
        </div>
        <div className="row" style={{position: "relative", top: "-20px"}}> 
          <Field 
            component={NewItemField} 
            name={"itemName"}
            type={"text"}
            icon={"assignment"}
            keyLabel={"ชื่อสินค้า"}
            faRequire={false}
          />
          <Field 
            component={NewItemField}
            name="initialItem"
            type={"number"}
            icon={"assignment_turned_in"}
            keyLabel={"จำนวนสินค้าเริ่มต้น"}
            faRequire={false}
          />
        </div>
        <div className="row" style={{position: "relative", top: "-20px"}}>
          <Field 
              component={NewItemField}
              name="cost"
              type={"number"}
              icon={"dollar-sign"}
              keyLabel={"ราคาต้นทุน"}
              faRequire={true}
          />
          <Field 
              component={NewItemField}
              name="income"
              type={"number"}
              icon={"hand-holding-usd"}
              keyLabel={"ราคาขาย"}
              faRequire={true}
          />
        </div>
        <div className="row" style={{position: "relative", top: "-20px"}}>
          <Field 
            component={NewItemField}
            name="itemWarning"
            type={"number"}
            icon={"exclamation"}
            keyLabel={"จำนวนสินค้าที่ต้องแจ้งเตือน"}
            faRequire={true}
          />
          <Field 
            component={NewItemCheckboxBoolean}
            name="isCreateTransaction"
            checkBoxLabel={"สร้างรายการนำเข้า-นำออกสินค้าเมื่อเปลี่ยนจำนวนสินค้าเริ่มต้น"}
          />

        </div>
        <div className="row" style={{position: "relative", top: "-20px"}}>
          <h6>
            - หมวดหมู่สินค้า   
            <span style={{position: "relative", left: "20px", fontSize: "12px"}}>
              <Link 
                to={{ pathname: "/categories/new", 
                state: {
                  stockName : this.props.stockName, 
                  mode: "create", 
                  currentStock: this.props.stockName} }} >
                  <i className="material-icons right">add</i>เพิ่มหมวดหมู่สินค้า
              </Link>
            </span>
          </h6>

        </div>
        <div className="row" style={{position: "relative", top: "-20px"}}>
            {!this.state.loadingCategory && (
                <div className="left">
                    <LoaderSpinner loading={this.state.loadingCategory} color={'#123abc'} doNotShift={true}/>
                </div>
                
            )}

            {this.state.loadingCategory && 
                this.renderCategory(this.props.category.categories)
            }
        </div>
      </div>
    )
  }
}

export default EditItemForm
