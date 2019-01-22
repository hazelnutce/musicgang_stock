import React, { Component } from 'react'
import M from 'materialize-css'
import _ from 'lodash'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {Link} from 'react-router-dom'

export class TransactionDetail extends Component {
    initCollapsible = () => {
        var elems = document.querySelectorAll('.collapsible');
        M.Collapsible.init(elems, {});
    }

    componentDidMount(){
        window.addEventListener('load', this.initCollapsible());
    }

  render() {  

    return (
        _.map(this.props.stocksInTransaction,(stock) => {
            return(
              <ul className="collapsible" style={{backgroundColor: "#eeeeee"}} key={stock._id}>
                <li>
                  <div className="collapsible-header"><i className="material-icons"><FontAwesomeIcon className="fas fa-sm" icon="boxes"/></i><Link to={{ state: {stockName : stock.stockName}, pathname: `/transactions/${stock._id}`}}>{stock.stockName}</Link></div>
                  <div className="collapsible-body">
                    <span>Lorem ipsum dolor sit amet.</span>
                  </div>
                </li>
              </ul>
            )
          })
    )
  }
}

export default TransactionDetail