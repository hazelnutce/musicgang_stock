import React, { Component } from 'react'
import EditItemForm from '../forms/newitem/EditItemForm'
import { reduxForm } from 'redux-form'
import { connect } from 'react-redux'
import {Link} from 'react-router-dom'

import {fetchCategory, fetchItem, editItem} from '../../actions/item'

export class EditItemPage extends Component {

  componentDidMount(){
    const {itemName, category, cost, revenue, itemWarning} = this.props.location.state

    this.props.fetchCategory()
    this.props.initialize({
      itemName,
      category,
      cost,
      income : revenue,
      itemWarning
    })
  }

  render() {
    console.log(this.props.editError)
    const {category, handleSubmit, history} = this.props
    const {stockId, stockName} = this.props.location.state
    var currentLocation = this.props.location.pathname.toString()
    var itemId = currentLocation.replace("/items/edit/", "")
    return (
        <div className="container" style={{position: "relative", top: "5px"}}>
            <div className="row">
                <h5 className="col s12"><i className="material-icons">edit</i><span style={{marginLeft: "20px"}}>แก้ไขสินค้า</span></h5>
            </div>
            <div className="row" style={{position: "relative", bottom: "10px"}}>
              <EditItemForm category={category} stockId={stockId}/>
            </div>
            <div className="row">
              <button onClick={handleSubmit((values) => this.props.editItem(values, itemId, stockId, stockName, history))} className="col xl2 push-xl7 l2 push-l7 m3 push-m6 s5 push-s2 green modal-close waves-effect waves-light btn" style={{marginRight: "20px"}}><i className="material-icons right">add_circle</i>Confirm</button> 
              <Link to={{ state: {stockName}, pathname: `/items/${stockId}`}} className="col xl2 push-xl7 l2 push-l7 m3 push-m6 s5 push-s2 red modal-close waves-effect waves-light btn"><i className="material-icons right">cancel</i>Cancel</Link>
            </div>
            {/* <div className="row">
              <a onClick={this.createNotification('info')} className="col xl2 push-xl7 l2 push-l7 m3 push-m6 s5 push-s2 green modal-close waves-effect waves-light btn">test</a>
            </div> */}
      </div>
    )
  }
}

function mapStateToProps(state){
  return {category: state.category, editError: state.item.errorEditMessage}
}

export default reduxForm({
  form : 'EditItemPage',
})(connect(mapStateToProps, {fetchCategory, fetchItem, editItem})(EditItemPage))
