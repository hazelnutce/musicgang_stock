import React, { Component } from 'react'
import {Field} from 'redux-form';

import NewItemField from './NewItemField';
import NewItemCategory from './NewItemCategory'

export class EditItemForm extends Component {
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
                name="cost"
                type={"number"}
                icon={"dollar-sign"}
                keyLabel={"ราคาต้นทุน"}
                faRequire={true}
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
                name="income"
                type={"number"}
                icon={"hand-holding-usd"}
                keyLabel={"ราคาขาย"}
                faRequire={true}
            />
        </div>
        <div className="row"> 
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

export default EditItemForm
