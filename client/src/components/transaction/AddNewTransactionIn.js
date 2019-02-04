import React, { Component } from 'react'
import {ErrorProcessNotice} from '../commons/ErrorProcessNotice'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import {reduxForm} from 'redux-form'
import {connect} from 'react-redux'
import {NewTransactionForm} from '../forms/newtransaction/NewTransactionForm'
import M from 'materialize-css'

import MomentLocaleUtils, {
  formatDate,
  parseDate,
} from 'react-day-picker/moment';
import {fetchItems} from '../../actions/item'

import 'moment/locale/th';
import 'react-day-picker/lib/style.css';

export class AddNewTransactionIn extends Component {
  constructor(props){
    super(props)

    this.state = {
      selectedDay: undefined
    }
  }

  componentDidMount(){
    this.props.fetchItems()
    var elems = document.querySelectorAll('.modal');
    M.Modal.init(elems, {
      opacity: 0.6,
      endingTop: '20%',
    });
  }

  handleDayChange = (day) => {
    this.setState({ selectedDay: day });
  }

  render() {
    const {stockName, items} = this.props.location.state
    if(stockName == null || items == null){
        return(
            <ErrorProcessNotice />
        )
    }
    return (
      <div className="container" style={{position: "relative", top: "5px"}}>
        <div className="row">
          <h6>นำเข้าสินค้า / คลัง : {stockName}</h6>
        </div>
        <div className="row">
          <label className="left">วันที่นำเข้า</label>
        </div>
        <div className="row" style={{bottom: "35px", position: "relative"}}>
              <DayPickerInput 
                classNames={{
                  container: "input-field col xl6 l8 m8 s12",
                  overlayWrapper: "DayPickerInput-OverlayWrapper",
                  overlay: "DayPickerInput-Overlay"
                }}
                onDayChange={this.handleDayChange} 
                formatDate={formatDate}
                parseDate={parseDate}
                format={"LL"}
                placeholder={`${formatDate(new Date(), 'LL', 'th')}`}
                dayPickerProps={{
                  locale: 'th',
                  localeUtils: MomentLocaleUtils,
                }}
              />
        </div>
        <div className="row" style={{bottom: "35px", position: "relative"}}>
          <div className="col xl12 l12 m12 s12">
            <h6>no record added</h6>
          </div>
          <div className="col xl12 l12 m12 s12">
            <div data-target="modal1" className="waves-effect waves-light btn-small modal-trigger" style={{position: "absolute", left: 0, zIndex: 0}}>
                เพิ่มรายการสินค้า  
            </div>
          </div>
        </div> {/*row*/}
        <div id="modal1" className="modal">
          <div className="modal-content">
            <NewTransactionForm items={items}/>
          </div>
          <div className="modal-footer"> 
            <button className="modal-close waves-effect waves-green btn-flat">close</button>
          </div>
        </div>
    </div> //container
    )
  }
}

function mapStateToProps(state) {
  return {
    items: state.items
  }
}

export default reduxForm({
  form: "newTransactionForm"
})(connect(mapStateToProps, {fetchItems})(AddNewTransactionIn))

