import React, { Component } from 'react'
import {MonthPicker} from '../commons/MonthPicker'

export class TransactionListSummaryPage extends Component {
    constructor(props){
        super(props)

        var d = new Date()
        var n = d.getMonth()
        var y = d.getFullYear()

        this.state = {
            currentMonth : (y + 543) * 12 + n
        }
    }

    handleAddMonth = () => {
        this.setState({currentMonth: this.state.currentMonth + 1})
    }

    handleMinusMonth = () => {
        this.setState({currentMonth: this.state.currentMonth - 1})
    }

    handleSetMonth = (integerMonth) => {
        this.setState({currentMonth: integerMonth})
    }

    render() {
      const {isSelectAllTransaction, isSelectTransactionIn, isSelectTransactionOut} = this.props
      if(isSelectAllTransaction === true){
        return (
                <div className="container-fluid">
                    <div className="row">
                        <div className="col x12 l12 m12 s12 center">
                            <MonthPicker 
                                handleAddMonth={this.handleAddMonth} 
                                handleMinusMonth={this.handleMinusMonth} 
                                handleSetMonth={this.handleSetMonth}
                                currentMonth={this.state.currentMonth} 
                            />
                        </div>
                        <div className="col xl6 l6 m12 s12">
                            <div className="col xl12 l12 m12 s12" style={{right: "5px", position: "relative"}}>
                                <h6>สินค้านำเข้า</h6>
                            </div>
                            <div className="col card small xl12 l12 m12 s12" style={{right: "5px", position: "relative"}}>
                            <table className="highlight">
                                <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Item Name</th>
                                    <th>Item Price</th>
                                </tr>
                                </thead>
                
                                <tbody>
                                <tr>
                                    <td>Alvin</td>
                                    <td>Eclair</td>
                                    <td>$0.87</td>
                                </tr>
                                <tr>
                                    <td>Alan</td>
                                    <td>Jellybean</td>
                                    <td>$3.76</td>
                                </tr>
                                <tr>
                                    <td>Jonathan</td>
                                    <td>Lollipop</td>
                                    <td>$7.00</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        </div>        
                        <div className="col xl6 l6 m12 s12">
                            <div className="col xl12 l12 m12 s12" style={{left: "5px", position: "relative"}}>
                                <h6>สินค้านำออก</h6>
                            </div>
                            <div className="col card small xl12 l12 m12 s12" style={{right: "5px", position: "relative"}}>
                                <table className="highlight">
                                    <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Item Name</th>
                                        <th>Item Price</th>
                                    </tr>
                                    </thead>
                    
                                    <tbody>
                                    <tr>
                                        <td>Alvin</td>
                                        <td>Eclair</td>
                                        <td>$0.87</td>
                                    </tr>
                                    <tr>
                                        <td>Alan</td>
                                        <td>Jellybean</td>
                                        <td>$3.76</td>
                                    </tr>
                                    <tr>
                                        <td>Jonathan</td>
                                        <td>Lollipop</td>
                                        <td>$7.00</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            
        )
      }
      else if(isSelectTransactionIn === true){
        return (
            <div className="row">
                <div className="col x12 l12 m12 s12 center">
                    <MonthPicker 
                        handleAddMonth={this.handleAddMonth} 
                        handleMinusMonth={this.handleMinusMonth} 
                        handleSetMonth={this.handleSetMonth}
                        currentMonth={this.state.currentMonth} 
                    />
                </div>
                <div className="col xl12 l12 m12 s12" style={{right: "5px", position: "relative"}}>
                    <h6>สินค้านำเข้า</h6>
                </div>
                <div className="col card small xl12 l12 m12 s12" style={{right: "5px", position: "relative"}}>
                    <table className="highlight">
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Item Name</th>
                            <th>Item Price</th>
                        </tr>
                        </thead>
        
                        <tbody>
                        <tr>
                            <td>Alvin</td>
                            <td>Eclair</td>
                            <td>$0.87</td>
                        </tr>
                        <tr>
                            <td>Alan</td>
                            <td>Jellybean</td>
                            <td>$3.76</td>
                        </tr>
                        <tr>
                            <td>Jonathan</td>
                            <td>Lollipop</td>
                            <td>$7.00</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
      }
      else if(isSelectTransactionOut === true){
        return (
            <div className="row">
                <div className="col x12 l12 m12 s12 center">
                    <MonthPicker 
                        handleAddMonth={this.handleAddMonth} 
                        handleMinusMonth={this.handleMinusMonth} 
                        handleSetMonth={this.handleSetMonth}
                        currentMonth={this.state.currentMonth} 
                    />
                </div>
                <div className="col xl12 l12 m12 s12" style={{left: "5px", position: "relative"}}>
                    <h6>สินค้านำออก</h6>
                </div>
                <div className="col card small xl12 l12 m12 s12" style={{left: "5px", position: "relative", height: "500px"}}>
                    <table className="highlight">
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Item Name</th>
                            <th>Item Price</th>
                        </tr>
                        </thead>
        
                        <tbody>
                        <tr>
                            <td>Alvin</td>
                            <td>Eclair</td>
                            <td>$0.87</td>
                        </tr>
                        <tr>
                            <td>Alan</td>
                            <td>Jellybean</td>
                            <td>$3.76</td>
                        </tr>
                        <tr>
                            <td>Jonathan</td>
                            <td>Lollipop</td>
                            <td>$7.00</td>
                        </tr>
                        <tr>
                            <td>Jonathan</td>
                            <td>Lollipop</td>
                            <td>$7.00</td>
                        </tr>
                        <tr>
                            <td>Jonathan</td>
                            <td>Lollipop</td>
                            <td>$7.00</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
      }
    
  }
}

export default TransactionListSummaryPage
