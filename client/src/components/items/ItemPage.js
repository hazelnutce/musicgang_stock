import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'

import {LoaderSpinner} from '../commons/LoaderSpinner'
import {fetchItems} from '../../actions/item'

const buttonInLine = <span className="right">
<Link to="/items/add/new" className="waves-effect waves-light btn-small amber darken-3"><i className="material-icons right">add</i>Add item</Link>
</span>

export class ItemPage extends Component {
    constructor(props){
        super(props)
    
        this.state = {
          loadingItem: false
        }
    }

    renderItemTable = () => {
        return (
            
            <table className="highlight reponsive-table">
                <thead>
                <tr>
                    <th>Item Name</th>
                    <th>Tag</th>
                    <th>Item Cost</th>
                    <th>Item Price</th>
                    <th>Remaining</th>
                </tr>
                </thead>

                <tbody>
                <tr>
                    <td>D'addario</td>
                    <td>Guitar</td>
                    <td>142</td>
                    <td>190</td>
                    <td>6</td>
                </tr>
                <tr>
                    <td>Ernie Ball</td>
                    <td>Guitar</td>
                    <td>135</td>
                    <td>180</td>
                    <td>4</td>
                </tr>
                <tr>
                    <td>Drum stick Nova 5A</td>
                    <td>Drum</td>
                    <td>124</td>
                    <td>150</td>
                    <td>14</td>
                </tr>
                </tbody>
            </table>  
    
        )
    }

    componentDidMount = () => {
        var currentLocation = this.props.location.pathname.toString()
        var stockId = currentLocation.replace("/items/", "")
        this.props.fetchItems(stockId)
        this.setState({loadingItem: true})
    }
    
    render() {
        if(!this.state.loadingItem){
            return (
              <LoaderSpinner loading={this.state.loadingCategory} color={'#123abc'}/>
            )
        }
        return (
        <div className="container" style={{position: "relative", top: "5px"}}>
            <div className="row">
                <h5 className="col s12">Items {buttonInLine}</h5>
            </div>
            <div className="row">
                {this.renderItemTable()}
            </div>
        </div>
        )
    }
}

export default connect(null, {fetchItems})(ItemPage)
