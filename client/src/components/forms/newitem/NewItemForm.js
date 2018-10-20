import React, { Component } from 'react'
import {Field} from 'redux-form';

import NewItemField from './NewItemField';
import {NewItemCheckbox} from './NewItemCheckbox'

const weekdayOptions = [
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
  { value: 7, label: 'Sunday' },
];

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
            name={"itemname"}
            type={"text"}
            icon={"assignment"}
            keyLabel={"Item Name"}
        />

        <Field 
            component={NewItemField}
            name="initialitem"
            type={"number"}
            icon={"assignment_turned_in"}
            keyLabel={"Initial stock amount"}
        />

        {this.state.loadingCategory && 
        <Field
            name="weekdays"
            label="Weekdays"
            keys="Checkboxes"
            component={NewItemCheckbox}
            options={this.flattenObject(this.props.category.categories)}
        />}
      
      </div>
    )
  }
}

export default NewItemForm