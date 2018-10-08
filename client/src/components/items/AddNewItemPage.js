import React, { Component } from 'react'
import {NewItemForm} from '../forms/newitem/NewItemForm'
import {reduxForm} from 'redux-form'

export class AddNewItemPage extends Component {
  render() {
      
    return (
        <div className="container" style={{position: "relative", top: "5px"}}>
          <div className="row">
            <h5>New Items</h5>
          </div>
          <div className="row" style={{position: "relative", bottom: "10px"}}>
            <NewItemForm />
          </div>
        </div>
    )
  }
}

export default reduxForm({
  form : 'newItemForm',
})(AddNewItemPage)
