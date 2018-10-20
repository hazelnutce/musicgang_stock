import React, { Component } from 'react'
import {reduxForm} from 'redux-form'
import {connect} from 'react-redux'

import {NewItemForm} from '../forms/newitem/NewItemForm'
import {fetchCategory} from '../../actions/item'

export class AddNewItemPage extends Component {
  componentDidMount = () => {
    this.props.fetchCategory()
  }
  
  render() {
    const {fetchCategory,category} = this.props
    var currentLocation = this.props.location.pathname.toString()
    var stockId = currentLocation.replace("/items/add/new/", "")
    return (
        <div className="container" style={{position: "relative", top: "5px"}}>
          <div className="row">
            <h5>New Items</h5>
          </div>
          <div className="row" style={{position: "relative", bottom: "10px"}}>
            <NewItemForm fetchCategory={fetchCategory} category={category} stockId={stockId}/>
          </div>
        </div>
    )
  }
}

function mapStateToProps(state){
  return {category: state.category}
}

export default reduxForm({
  form : 'newItemForm',
})(connect(mapStateToProps,{fetchCategory})(AddNewItemPage))
