import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {Link} from 'react-router-dom'

const shiftLeft10 = {
    left: "10px",
    position: "relative"
}

export class MusicroomTransactionPage extends Component {
    constructor(props){
        super(props)

        this.state = {
            isSelectAllTransaction : true,
            isSelectTransactionIn : true,
            isSelectTransactionOut : true,
            isLoadingItem: false
        }
    }

    handleCheckboxes = (buttonString) => {
        if(buttonString === "1"){
            if(this.state.isSelectAllTransaction === false){
                this.setState({
                    isSelectAllTransaction : true,
                    isSelectTransactionIn : true,
                    isSelectTransactionOut : true,
                })
            }
        }
        else if(buttonString === "2"){
            this.setState({
                isSelectAllTransaction : false,
                isSelectTransactionIn : true,
                isSelectTransactionOut : false,
            })
        }
        else if(buttonString === "3"){
            this.setState({
                isSelectAllTransaction : false,
                isSelectTransactionIn : false,
                isSelectTransactionOut : true,
            })
        }
    }

    render() {
        return (
            <div className="container" style={{position: "relative", top: "5px"}}>
                <div className="row">
                    <div className="col xl9 l9 m8 s12">
                        <h5 className="col s12 m12 l12 xl12">
                            <i >
                                <FontAwesomeIcon className="fas fa-sm" icon="music"/>
                            </i>
                            <span style={shiftLeft10}>บันทึกห้องซ้อม</span>
                        </h5>
                        <div className="col s12 m12 l12 xl12">
                            <label className="col xl4 l4 m5 s6">
                                <input type="checkbox" className="filled-in" onChange={() => this.handleCheckboxes("1")} checked={this.state.isSelectAllTransaction} />
                                <span>แสดงรายการทั้งหมด</span>
                            </label>
                            <label className="col xl4 l4 m5 s6">
                                <input type="checkbox" className="filled-in" onChange={() => this.handleCheckboxes("2")} checked={this.state.isSelectTransactionIn} />
                                <span>รายการห้องซ้อมเล็ก</span>
                            </label>
                            <label className="col xl4 l4 m5 s6">
                                <input type="checkbox" className="filled-in" onChange={() => this.handleCheckboxes("3")} checked={this.state.isSelectTransactionOut} />
                                <span>รายการห้องซ้อมใหญ่</span>
                            </label>
                        </div>
                    </div>
                    <div className="col xl3 l3 m4 s12" >
                        <div className="col xl12 l12 m12 s12" style={{top: "40px", position: "relative"}}>
                            <Link to={{ pathname: `/musicrooms/new`}} className="waves-effect waves-light btn-small green accent-3"><i className="material-icons right">arrow_upward</i>เพิ่มรายการห้องซ้อม</Link>
                        </div>
                    </div>
                </div>
                
            </div>
    )
  }
}

export default MusicroomTransactionPage
