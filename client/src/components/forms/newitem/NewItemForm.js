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
    var query = (categorys.filter((item) => item._stock === this.props.stockId))
    var allCategoryName =  query.map(x => (({ categoryName}) => ({categoryName}))(x))
    return allCategoryName
  }

  render() { 
    return (
      <div>
        <Field 
            component={NewItemField} 
            name={"itemName"}
            type={"text"}
            icon={"assignment"}
            keyLabel={"Item Name"}
            faRequire={false}
        />

        <Field 
            component={NewItemField}
            name="initialItem"
            type={"number"}
            icon={"assignment_turned_in"}
            keyLabel={"Initial stock amount"}
            faRequire={false}
        />

        {this.state.loadingCategory &&
        <Field
          component={NewItemCategory}
          name="category"
          type={"text"}
          icon={"tag"}
          keyLabel={"Item category"}
          options={this.flattenObject(this.props.category.categories)}
        />}

        <Field 
            component={NewItemField}
            name="cost"
            type={"number"}
            icon={"dollar-sign"}
            keyLabel={"Item cost"}
            faRequire={true}
        />

        <Field 
            component={NewItemField}
            name="income"
            type={"number"}
            icon={"hand-holding-usd"}
            keyLabel={"Item income"}
            faRequire={true}
        />

        <Field 
            component={NewItemField}
            name="itemWarning"
            type={"number"}
            icon={"exclamation"}
            keyLabel={"Item warning amount"}
            faRequire={true}
        />
      
      </div>
    )
  }
}

export default NewItemForm