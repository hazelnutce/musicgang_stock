import React, { Component } from 'react'
import {connect} from 'react-redux'
import {LoaderSpinner} from '../commons/LoaderSpinner'

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

    renderCategories = (categories) => {
        if(categories.length === 0){
            return(
              <div className="card-panel yellow darken-1" style={{marginLeft: "10px",top:"-20px",position:"relative"}}>
                <span className="white-text">
                  <span><i className="material-icons" style={{marginLeft: "10px",top:"5px",position:"relative"}}>warning</i></span>
                  <span style={{marginLeft: "10px"}}>You didn't have any categories. Please create one.</span>
                </span>
              </div>
            )
        }
    }

    componentDidMount = () => {
        this.props.fetchCategory()
    }

    componentDidUpdate = (prevProps, prevState) => {
      if(prevProps.category.categories !== this.props.category.categories){
        this.setState({loadingCategory: true})
      }
      if(prevProps.category.stockDetails !== this.props.category.stockDetails){
        this.setState({loadingStock: true})
      }
    }
    
    render() {
        const {category} = this.props
        if(!this.state.loadingCategory){
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
                {this.renderCategories(category.categories)}
            </div>   
        </div>
        )
    }
}

function mapStateToProps(state) {
    return { category: state.category}
}

export default connect(mapStateToProps,{fetchCategory})(CategoryPage)
