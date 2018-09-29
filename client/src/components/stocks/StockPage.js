import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import M from 'materialize-css'
import _ from 'lodash'

import {fetchStock} from '../../actions/stock'
import StockDetail from './StockDetail'
import {LoaderSpinner} from '../commons/LoaderSpinner'

const buttonInLine = <span className="right">
<Link to="/stocks/new" className="waves-effect waves-light btn-small amber darken-3"><i className="material-icons right">add</i>Add stock</Link>
</span>

export class StockPage extends Component {
  constructor(props){
    super(props)

    this.state = {
      loadingStock: false
    }
  }

  renderStock = (stocks) => {
    if(stocks.length === 0){
      return(
        <div className="card-panel yellow darken-1" style={{marginLeft: "10px",top:"-20px",position:"relative"}}>
          <span className="white-text">
            <span><i className="material-icons" style={{marginLeft: "10px",top:"5px",position:"relative"}}>warning</i></span>
            <span style={{marginLeft: "10px"}}>You didn't have any stock. Please create one.</span>
          </span>
        </div>
      )
    }
    return(
      _.map(stocks,(stock) => {
        return(
          <StockDetail  key={stock.stockName} stockName={stock.stockName} itemCount={stock.itemCount} itemWarning={stock.itemWarning} itemDanger={stock.itemDanger} _id={stock._id}/>
        )
      })
      
    )
  }
  
  componentDidMount = () => {
    this.props.fetchStock()
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.stocks.stockList !== this.props.stocks.stockList) {
      if(this.props.stocks !== ""){
        this.setState({loadingStock:true},() => {
          var elems = document.querySelectorAll('.modal');
          M.Modal.init(elems, {
            opacity: 0.6
          });
        }) 
      }
    }
  }
  
  render() {
    const {stockList} = this.props.stocks
    if(!this.state.loadingStock){
      return (
        <LoaderSpinner loading={this.state.loadingCategory} color={'#123abc'}/>
      )
    }
    return (
      <div className="container" style={{position: "relative", top: "5px"}}>
        <div className="row">
          <h5 className="col s12">Stocks {buttonInLine}</h5>
        </div>
        <div className="row">
          <div className="col s12">
            {this.renderStock(stockList)}
          </div>
        </div>
        
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {stocks: state.stocks}
}

export default connect(mapStateToProps, {fetchStock})(StockPage)
