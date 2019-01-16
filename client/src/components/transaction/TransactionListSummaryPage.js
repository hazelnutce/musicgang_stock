import React, { Component } from 'react'

export class TransactionListSummaryPage extends Component {
    constructor(props){
        super(props)
    }

  render() {
      const {isSelectAllTransaction, isSelectTransactionIn, isSelectTransactionOut} = this.props
      if(isSelectAllTransaction === true){
        return (
                <div className="row">
                    <div className="col xl6" style={{right: "5px", position: "relative"}}>
                        <h6>สินค้านำเข้า</h6>
                    </div>
                    <div className="col xl6" style={{left: "5px", position: "relative"}}>
                        <h6>สินค้านำออก</h6>
                    </div>
                    <div className="col card small xl6" style={{right: "5px", position: "relative"}}>
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
                    <div className="col card small xl6" style={{left: "5px", position: "relative", height: "500px"}}>
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
      else if(isSelectTransactionIn === true){
        return (
            <div className="row">
                <div className="col xl12" style={{right: "5px", position: "relative"}}>
                    <h6>สินค้านำเข้า</h6>
                </div>
                <div className="col card small xl12" style={{right: "5px", position: "relative"}}>
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
                <div className="col xl12" style={{left: "5px", position: "relative"}}>
                    <h6>สินค้านำออก</h6>
                </div>
                <div className="col card small xl12" style={{left: "5px", position: "relative", height: "500px"}}>
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
