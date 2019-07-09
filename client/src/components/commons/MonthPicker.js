import React, { Component } from 'react'
import M from 'materialize-css'
import '../commons/linkButton.css'
import _ from 'lodash'

const monthString = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม']

export class MonthPicker extends Component {

  constructor(props){
    super(props)

    this.state = {
      currentYear : this.integerConvertToYear(this.props.currentMonth)
    }
  }

  handleMonthOnModal = (mode) => {
    if(mode === "add"){
      this.setState({currentYear: this.state.currentYear + 1})
    }
    else if(mode === "minus"){
      this.setState({currentYear: this.state.currentYear - 1})
    }
  }

  integerConvertToMonthYear = (year) => {
    return `${monthString[year%12]} ${parseInt(year/12)}`
  }

  integerConvertToYear = (year) => {
    return parseInt(year/12)
  }

  componentDidMount(){
    var elems = document.querySelectorAll('.modal');
    M.Modal.init(elems, {
      opacity: 0.6,
      endingTop: '20%',
      onOpenStart: () => {
        this.setState({currentYear: this.integerConvertToYear(this.props.currentMonth)})
      }
    });
  }

  componentDidUpdate(prevProps){
    if(prevProps.currentMonth !== this.props.currentMonth){
      this.setState({currentYear: this.integerConvertToYear(this.props.currentMonth)})
    }
  }

  renderMonthSelectorOnModal = () => {
    return _.map(monthString, (m, index) => {
      return(
        <div key={m} style={{height: "30px"}} onClick={() => {this.props.handleSetMonth(this.state.currentYear * 12 + index)}} className="col xl4 l4 m4 s6 waves-effect waves-light btn-small btn-flat modal-close">{m}</div>
      )
    })
  }

  render() {
    const disabled = this.props.disabled == true ? "disabled" : ""
    return (
      <div>
        <h6>
          <div onClick={() => this.props.handleMinusMonth()} className={`${disabled} waves-effect waves-light btn-small btn-flat`} style={{marginRight: "10px"}}>
              <i className="material-icons">
                chevron_left
              </i>
          </div>
          <span data-target="modal1" className="btn btn-flat modal-trigger" style={{top: "-3px", position: "relative"}}><h6>{this.integerConvertToMonthYear(this.props.currentMonth)}</h6></span>
          <div onClick={() => this.props.handleAddMonth()} className={`${disabled} waves-effect waves-light btn-small btn-flat`} style={{marginLeft: "10px"}}>
              <i className="material-icons">
                chevron_right
              </i>
          </div>
        </h6>
        <div id="modal1" className="modal">
          <div className="modal-content">
            <h6>
                <div onClick={() => this.handleMonthOnModal("minus")} className={`${disabled} waves-effect waves-light btn-small btn-flat`} style={{marginRight: "10px"}}>
                  <i className="material-icons">
                    chevron_left
                  </i>
                </div>
              {this.state.currentYear}
              <div onClick={() => this.handleMonthOnModal("add")} className={`${disabled} waves-effect waves-light btn-small btn-flat`} style={{marginLeft: "10px"}}>
                  <i className="material-icons">
                    chevron_right
                  </i>
              </div>
            </h6>
            <div className="container" style={{top: "5px", position: "relative"}}>
              <div className="row">
                {this.renderMonthSelectorOnModal()}
              </div>
            </div>
          </div>
          <div className="modal-footer"> 
            <button className="modal-close waves-effect waves-green btn-flat">close</button>
          </div>
        </div>
      </div>
    )
  }
}

export default MonthPicker
