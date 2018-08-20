import React, { Component } from 'react'
import {connect} from 'react-redux'
import {LoaderSpinner} from '../commons/LoaderSpinner'
import _ from 'lodash'

import {fetchCategory} from '../../actions/category'

const buttonInLine = <span className="right">
<a className="waves-effect waves-light btn-small amber darken-3"><i className="material-icons right">add</i>Add category</a>
</span>

export class CategoryPage extends Component {
    constructor(props){
        super(props)
    
        this.state = {
          loadingCategory: false,
          loadingStock: false
        }
    }

    renderCategories = (category) => {
        if(category.categories.length === 0 && category.stockDetails.length === 0){
            return(
              <div className="card-panel yellow darken-1" style={{marginLeft: "10px",top:"-20px",position:"relative"}}>
                <span className="white-text">
                  <span><i className="material-icons" style={{marginLeft: "10px",top:"5px",position:"relative"}}>warning</i></span>
                  <span style={{marginLeft: "10px"}}>You didn't have any categories. Please create one.</span>
                </span>
              </div>
            )
        }
        else if(category.stockDetails.length > 0){
            return _.map(category.stockDetails,stock => {
                return (
                    <div key={stock._id}>
                        <div className="row">
                            <h6><u>{stock.stockName}</u></h6> 
                        </div>
                        <div className="row">
                            <p className="grey-text" style={{marginLeft: "20px"}}><i className="material-icons" style={{top: "5px", position: "relative", marginRight: "10px"}}>warning</i>you didn't have any category in stock</p> 
                        </div>
                    </div>
                )
            })
        }
    }

    componentDidMount = () => {
        this.props.fetchCategory()
    }

    componentDidUpdate = (prevProps) => {
      const {categories, stockDetails} = prevProps.category
      if(categories !== this.props.category.categories){
        this.setState({loadingCategory: true})
      }
      if(stockDetails !== this.props.category.stockDetails){
        this.setState({loadingStock: true})
      }
    }
    
    render() {
        const {category} = this.props
        if(!(this.state.loadingCategory && this.state.loadingStock)){
            return (
              <LoaderSpinner loading={this.state.loadingCategory && this.state.loadingStock} color={'#123abc'}/>
            )
          }
        return (
        <div className="container" style={{top: "5px", position: "relative"}}>
            <div className="row">
            <h5 className="col s12">Categories {buttonInLine}</h5>
            </div>
            <div className="row">
                {this.renderCategories(category)}
            </div>   
        </div>
        )
    }
}

function mapStateToProps(state) {
    return { category: state.category}
}

export default connect(mapStateToProps,{fetchCategory})(CategoryPage)
