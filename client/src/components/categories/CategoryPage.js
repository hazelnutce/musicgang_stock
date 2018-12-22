import React, { Component } from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {LoaderSpinner} from '../commons/LoaderSpinner'
import M from 'materialize-css'
import {reduxForm} from 'redux-form'
import _ from 'lodash'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import {fetchCategory,addCategory,deleteCategory} from '../../actions/category'
import {NewCategoryForm} from '../forms/newcategory/NewCategoryForm'
import './CategoryPage.css'

export class CategoryPage extends Component {
    constructor(props){
        super(props)
    
        this.state = {
          loadingCategory: false,
          loadingStock: false
        }
    }

    renderButtonForAddCategory = () => {
        const buttonInLine = <span className="right">
            <Link to={{ pathname: "/categories/new", }}  className="waves-effect waves-light btn-small amber darken-3"><i className="material-icons right">add</i>เพิ่มหมวดหมู่สินค้า</Link>
        </span>

        return buttonInLine
    }

    renderCategories = (category) => {
        if(category.categories.length === 0 && category.stockDetails.length === 0){
            return(
              <div className="card-panel yellow darken-1" style={{marginLeft: "10px",top:"-20px",position:"relative"}}>
                <span className="white-text">
                  <span><i className="material-icons" style={{marginLeft: "10px",top:"5px",position:"relative"}}>warning</i></span>
                  <span style={{marginLeft: "10px"}}>คุณไม่ได้สร้างการจัดการหมวดหมู่ไว้ที่คลังสินค้านี้</span>
                </span>
              </div>
            )
        }
        else if(category.stockDetails.length > 0){
            return _.map(category.stockDetails,stock => {
                var query = (category.categories.filter((item) => item._stock === stock._id))
                return (
                    <div key={stock._id}>
                        <div className="row">
                            <h6><u>{stock.stockName}</u></h6> 
                        </div>
                        <div className="row" style={{height: "auto"}}>
                            {this.renderCategoryPanels(query)}
                        </div>
                    </div>
                )
            })
        }
    }

    renderCategoryPanels = (categorys) => {
        
        if(categorys.length === 0){
            return(
                <div className="row">
                    <p className="grey-text" style={{marginLeft: "20px"}}><i className="material-icons" style={{top: "5px", position: "relative"}}>warning</i>you didn't have any category in stock</p> 
                </div>
            )
        }
        return _.map(categorys,category => {
            return(
                <div key={category._id} >
                    <div className="col s1"style={{width: "auto"}}>
                        <div className="card-panel teal" style={{paddingRight: "5px"}}>
                            <span className="center" id="categoryNamePanel">{category.categoryName}<a className="btn-flat modal-trigger" href={`#${category._id}`} style={{bottom: "2px", position: "relative"}}><i className="waves-effect material-icons ">cancel</i></a></span>  
                        </div>
                    </div>
                    <div id={category._id} className="modal deleteCategory">
                        <div className="modal-content">
                            <h4>ยืนยันการลบ</h4>
                            <p>คุณต้องการจะลบหมวดหมู่ <b>{category.categoryName}</b> ใช่หรือไม่ ?</p>
                        </div>
                        <div className="modal-footer">
                            <button className="red modal-close waves-effect waves-light btn right"><i className="material-icons right">cancel</i>ยกเลิก</button>
                            <button onClick={() => this.props.deleteCategory(category._id)} className="green modal-close waves-effect waves-light btn right" style={{position: "relative", right: "20px"}}><i className="material-icons right">add_circle</i>ยืนยัน</button> 
                        </div>
                    </div>
                </div>
                
            )
        })
        
    }

    componentDidMount = () => {
        this.props.fetchCategory()
        
    }

    componentDidUpdate = (prevProps, prevState) => {
      const {categories, stockDetails} = prevProps.category
      if(categories !== this.props.category.categories){
        this.setState({loadingCategory: true})
      }
      if(stockDetails !== this.props.category.stockDetails){
        this.setState({loadingStock: true})
      }
      if(prevState !== this.state){
        if(this.state.loadingCategory && this.state.loadingStock){
            var elems = document.querySelectorAll('#addCategory');
              M.Modal.init(elems, {
                opacity: 0.6
            });
            var elems2 = document.querySelectorAll('.deleteCategory');
            M.Modal.init(elems2, {
                opacity: 0.6
            })
        }
      }
      
    }
    
    render() {
        const {category} = this.props
        const {stockDetails} = category
        if(!(this.state.loadingCategory && this.state.loadingStock)){
            return (
              <LoaderSpinner loading={this.state.loadingCategory && this.state.loadingStock} color={'#123abc'}/>
            )
          }
        return (
            
            <div className="container" style={{top: "5px", position: "relative"}}>
                <div className="row">
                <h5 className="col s12"><i><FontAwesomeIcon icon="tags"/></i><span style={{marginLeft: "20px"}}>หมวดหมู่สินค้า</span>{this.renderButtonForAddCategory()}</h5>
                </div>
                <div className="row">
                    {this.renderCategories(category)}
                </div>
                <div className="row">
                    <div id="addCategory" className="modal col s6 offset-s1">
                        <div className="modal-content">
                            <h5>เพิ่มหมวดหมู่สินค้า</h5>
                            <NewCategoryForm />
                        </div>
                        <div className="modal-footer">
                            <button className="red modal-close waves-effect waves-light btn right"><i className="material-icons right">cancel</i>Cancel</button>
                            <button onClick={this.props.handleSubmit((values) => this.props.addCategory(values,stockDetails))} className="green modal-close waves-effect waves-light btn right" style={{position: "relative", right: "20px"}}><i className="material-icons right">add_circle</i>Confirm</button> 
                        </div>
                    </div>
                </div>
            </div>
        
        )
    }
}

function mapStateToProps(state) {
    return { category: state.category}
}

export default reduxForm({
    form: 'newCategoryForm'
})(connect(mapStateToProps,{fetchCategory,addCategory,deleteCategory})(CategoryPage))
