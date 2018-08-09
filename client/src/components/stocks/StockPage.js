import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import { RingLoader } from 'react-spinners';

import {fetchStock} from '../../actions/stock'

const buttonInLine = <span className="right">
<Link to="/stocks/new" className="waves-effect waves-light btn-small"><i className="material-icons right">add</i>Add stock</Link>
</span>

export class StockPage extends Component {
  constructor(props){
    super(props)

    this.state = {
      loadingStock: false
    }
  }
  
  componentDidMount = () => {
    this.props.fetchStock()
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.stocks !== this.props.stocks) {
      if(this.props.stocks !== ""){
        this.setState({loadingStock:true})
      }
    }
  }
  
  render() {
    if(!this.state.loadingStock){
      return (
        <div className="container" style={{position: "relative", top: "50px"}}>
          <div className="row">
            <div className='col s2 offset-s6'>
            <RingLoader
              color={'#123abc'} 
              loading={!this.state.loadingStock} 
            />
            </div>
          </div>
        </div>
      )
    }
    return (
      <div className="container" style={{position: "relative", top: "5px"}}>
        <div className="row">
          <h5 className="col s12">Stocks {buttonInLine}</h5>
        </div>
        <div className="row">
          <div className="col s12">
            <div className="card-panel yellow darken-1" style={{marginLeft: "10px",top:"-20px",position:"relative"}}>
              <span className="white-text">
                <span><i className="material-icons" style={{marginLeft: "10px",top:"5px",position:"relative"}}>warning</i></span>
                <span style={{marginLeft: "10px"}}>You didn't have any stock. Please create one.</span>
              </span>
            </div>
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
