import React, { Component } from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {LoaderSpinner} from '../commons/LoaderSpinner'
import {reduxForm} from 'redux-form'
import _ from 'lodash'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import M from 'materialize-css'

import {fetchCategory,addCategory,deleteCategory} from '../../actions/category'
import {fetchStock} from '../../actions/stock'
import './CategoryPage.css'

export class CategoryPage extends Component {
    constructor(props){
        super(props)
    
        this.state = {
          loadingCategory: false,
          loadingStock: false,
          currentStock: ""
        }
    }

    renderButtonForAddCategory = () => {
        const buttonInLine = <span style={{top: "25px", position: "relative"}}>
            <Link to={{ pathname: "/categories/new", state: {stockName : this.props.stocks, mode: "create", currentStock: this.state.currentStock} }}  className="waves-effect waves-light btn-small amber darken-3"><i className="material-icons right">add</i>เพิ่มหมวดหมู่สินค้า</Link>
        </span>

        return buttonInLine
    }

    renderCategories = (stocks, categories) => {
        return(
            <div>
                {this.renderCategoryPanels(categories)}
            </div>
        )
    }

    renderColumnHeader = () => {
        const criteriaArray = ["categoryNameTh", "categoryEn", "ExampleTag"]
        const columnName = ["หมวดหมู่สินค้า (Thai)", "หมวดหมู่สินค้า (Eng)", "แท็กตัวอย่าง"]
        const buttonClassName = "btn-flat waves-effect"

        return _.map(criteriaArray, (criteria, index) => {
            return (
                <th key={criteria}>
                    <button className={buttonClassName}>{columnName[index]}
                    </button>
                </th>
            )
        })
    }

    renderItem(categorys){
        const filteredCategory = categorys.filter(x => {
            return x.stockName === this.state.currentStock
        })
        return _.map(filteredCategory, (item) => {
            const {categoryNameTh, categoryNameEn, labelColor, textColor, _id, stockName} = item
            return(
                    <tr key={item._id}>
                        <td>{categoryNameTh}</td>
                        <td>{categoryNameEn}</td>
                        <td>
                            <span style={{backgroundColor : labelColor, color: textColor, fontWeight: "bold"}} className="new badge " data-badge-caption={categoryNameTh || "ตัวอย่าง"}></span>
                            <span style={{marginLeft: "10px", backgroundColor : labelColor, color: textColor, fontWeight: "bold"}} className="new badge " data-badge-caption={categoryNameEn || "ตัวอย่าง"}></span>
                        </td>
                        <td>
                            <Link to={{ pathname: `/categories/new`, 
                                state: {
                                    stockName : this.props.stocks, 
                                    mode : "edit",
                                    categoryNameEn,
                                    categoryNameTh,
                                    labelColor,
                                    textColor,
                                    _stockName : stockName,
                                    _id
                                }
                            }} 
                                className="material-icons black-text">edit
                            </Link>
                            <a className="modal-trigger" href={"#"+_id}><i className="material-icons black-text">delete</i></a>
                        </td>
                        <td>
                            <div id={_id} className="modal">
                                <div className="modal-content">
                                    <h4>ยืนยันการลบ</h4>
                                    <p>คุณต้องการจะลบสินค้า <b>{categoryNameTh}</b> ใช่หรือไม่ ?</p>
                                </div>
                                <div className="modal-footer">
                                    <button onClick={() => this.props.deleteCategory(_id)} className="green modal-close waves-effect waves-light btn" style={{position: "relative", right: "20px"}}><i className="material-icons right">add_circle</i>ยืนยัน</button> 
                                    <button className="red modal-close waves-effect waves-light btn"><i className="material-icons right">cancel</i>ยกเลิก</button>
                                </div>
                            </div> 
                        </td>
                    </tr>          
            )
        })
    }

    renderCategoryPanels = (categorys) => {
        if(categorys.length === 0){
            return(
                <div className="row">
                    <p className="grey-text" style={{marginLeft: "20px"}}><i className="material-icons" style={{top: "5px", position: "relative"}}>warning</i>you didn't have any category in stock</p> 
                </div>
            )
        }
        else{
            return (   
                <table className="highlight reponsive-table centered">
                    <thead>
                    <tr>
                        {this.renderColumnHeader()}
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                        {this.renderItem(categorys)}
                    </tbody>
                </table>  
        
            ) 
        }  
    }

    handleStockNameChange(e){
        e.preventDefault()
        this.setState({currentStock: e.target.value})
    }

    renderStock(stocks){
        return _.map(stocks, stock => {
            return(
                <option value={stock.stockName} key={stock._id}>{stock.stockName}</option>
            )
        })
    }

   renderStockSelector(stocks){
        return (
            <div className="input-field">
                    <i className="material-icons prefix"><FontAwesomeIcon icon="boxes"/></i>
                    <select className="stockselector" onChange={(e) => this.handleStockNameChange(e)}>
                        {this.renderStock(stocks)}
                    </select>
                    <label>คลังสินค้า</label>
                    
            </div> 
        )
   }

    componentDidMount = () => {
        this.props.fetchCategory()
        this.props.fetchStock() 
    }

    componentDidUpdate = (prevProps) => {
     if(prevProps.stocks !== this.props.stocks || prevProps.category.categories !== this.props.category.categories){
        if(this.props.stocks != null && this.props.category.categories != null){
            this.setState({
                loadingCategory: true,
                loadingStock: true
            }, () => {
                this.setState({currentStock: this.props.stocks[0].stockName})
                var elems = document.querySelectorAll('.modal');
                M.Modal.init(elems, {
                    opacity: 0.6
                });
                elems = document.querySelectorAll('.stockselector');
                M.FormSelect.init(elems, {});
            })
          }
     }
    }
    
    render() {
        if(!(this.state.loadingCategory && this.state.loadingStock)){
            return (
              <LoaderSpinner loading={this.state.loadingCategory && this.state.loadingStock} color={'#123abc'}/>
            )
          }
        else{
            if(this.props.stocks.length === 0){
                return(
                    <div className="container" style={{top: "5px", position: "relative"}}>
                        <div className="row">
                            <h5 className="col s12"><i><FontAwesomeIcon icon="tags"/></i><span style={{marginLeft: "20px"}}>หมวดหมู่สินค้า</span></h5>
                        </div>
                        <div className="row">
                            <p>คุณยังไม่มีคลังสินค้าใดๆในระบบนี้ <Link to="/stocks/new">สร้างคลังสินค้าใหม่</Link></p>
                        </div>
                    </div>
                )
                
            }
            else{
                return (
                    <div className="container" style={{top: "5px", position: "relative"}}>
                        <div className="row">
                            <h5 className="col s12"><i><FontAwesomeIcon icon="tags"/></i><span style={{marginLeft: "20px"}}>หมวดหมู่สินค้า</span></h5>
                        </div>
                        <div className="row">
                            <div className="col s12 m6 l6 xl6">
                                {this.renderStockSelector(this.props.stocks)} 
                            </div>
                            <div className="col s12 m6 l6 xl6">
                                {this.renderButtonForAddCategory()}
                            </div>
                        </div>
                        <div className="row" style={{top: "-30px", position: "relative"}}>
                            {this.renderCategories(this.props.stocks, this.props.category.categories)}
                        </div>
                    </div>
                )
            }
        }

    }
}

function mapStateToProps(state) {
    return { category: state.category, stocks: state.stocks.stockList}
}

export default reduxForm({
    form: 'newCategoryForm'
})(connect(mapStateToProps,{fetchCategory,addCategory,deleteCategory,fetchStock})(CategoryPage))
