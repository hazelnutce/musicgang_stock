import React, { Component } from 'react'
import moment from 'moment'

export class CostMonthlySummaryPanel extends Component {
    numberWithCommas(x) {
        if(x != null){
          var parts = x.toString().split(".");
          parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          return parts.join(".");
        }
        return null
    }

    setCurrentMonthToString = (month) => {
        let day = new Date(month / 12, month % 12, 1)
        return moment(day).format('MMM YYYY')
    }

    render() {
        const {color, currentMonth, cost, message} = this.props
        return (
            <div className="col xl6 l6 m12 s12">
                <div className={`card-panel ${color}`} style={{height: "60px"}}>
                    <span className="white-text" style={{top:"-10px",position:"relative"}}>
                        <span><i className="material-icons" style={{marginLeft: "10px",top:"5px",position:"relative"}}>attach_money</i></span>
                        <span style={{marginLeft: "10px"}}>{`${message} (${this.setCurrentMonthToString(currentMonth)}) : ${this.numberWithCommas(parseFloat(cost).toFixed(2))}`}</span>
                    </span>
                </div>
            </div>
        )
    }
}

export default CostMonthlySummaryPanel
