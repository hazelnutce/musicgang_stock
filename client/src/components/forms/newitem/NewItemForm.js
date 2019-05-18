import React, { Component } from 'react'
import {Field} from 'redux-form';

import NewItemField from './NewItemField';
import NewItemCategory from './NewItemCategory'

export class NewItemForm extends Component {
  constructor(props){
    super(props)

    this.state = {
      loadingCategory: false
    }
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
        <div className="row">
          {!this.state.loadingCategory &&
          <Field
            component={NewItemCategory}
            name="category"
            type={"text"}
            icon={"tag"}
            keyLabel={"หมวดหมู่สินค้า"}
            options={null}
          />}

          {this.state.loadingCategory &&
          <Field
            component={NewItemCategory}
            name="category"
            type={"text"}
            icon={"tag"}
            keyLabel={"หมวดหมู่สินค้า"}
            options={this.flattenObject(this.props.category.categories)}
          />}

          <Field 
              component={NewItemField}
              name="cost"
              type={"text"}
              icon={"dollar-sign"}
              keyLabel={"ราคาต้นทุน"}
              faRequire={true}
              normalize={(val, prevVal) => {
                if (val) {
                  return (/^\d+\.{0,1}\d{0,2}$/.test(val)) ? val : prevVal
                }
                return val;
              }}
              inputmode="numeric"
          />
        </div>
        <div className="row">
        <Field 
            component={NewItemField}
            name="income"
            type={"text"}
            icon={"hand-holding-usd"}
            keyLabel={"ราคาขาย"}
            faRequire={true}
            normalize={(val, prevVal) => {
              if (val) {
                return (/^\d+\.{0,1}\d{0,2}$/.test(val)) ? val : prevVal
              }
              return val;
            }}
            inputmode="numeric"
        />

        <Field 
            component={NewItemField}
            name="itemWarning"
            type={"number"}
            icon={"exclamation"}
            keyLabel={"จำนวนสินค้าที่ต้องแจ้งเตือน"}
            faRequire={true}
        />
        </div>
      </div>
    )
  }
}

export default NewItemForm