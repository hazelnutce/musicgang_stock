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
            <h5>เพิ่มสินค้า</h5>
          </div>
          <div className="row" style={{position: "relative", bottom: "10px"}}>
            <NewItemForm fetchCategory={fetchCategory} category={category} stockId={stockId}/>
          </div>
          <div className="row">
            <a className="col xl2 push-xl7 l2 push-l7 m3 push-m6 s5 push-s2 green modal-close waves-effect waves-light btn" style={{marginRight: "20px"}}><i className="material-icons right">add_circle</i>Confirm</a> 
            <a className="col xl2 push-xl7 l2 push-l7 m3 push-m6 s5 push-s2 red modal-close waves-effect waves-light btn"><i className="material-icons right">cancel</i>Cancel</a>
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
