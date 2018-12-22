import React, { Component } from 'react'
import M from 'materialize-css'

const keyLabel = ["ชื่อภาษาไทย(TH)", "ชื่อภาษาอังกฤษ(EN)"]

export class CategoryNewPage extends Component {

    constructor(props){
        super(props)

        this.state = {
            thaiCategoryName : "",
            engCategoryName : "",
            stockName: ""
        }
    }

    handleThaiCategoryNameChange = (e) => {
        e.preventDefault()
        this.setState({thaiCategoryName: e.target.value})
    }

    handleEngCategoryNameChange = (e) => {
        e.preventDefault()
        this.setState({engCategoryName: e.target.value})
    }

    handleStockNameChange = (e) => {
        console.log(e)
        e.preventDefault()
        this.setState({stockName: e.target.value})
    }

    componentDidMount(){
        document.addEventListener('DOMContentLoaded', function() {
            var elems = document.querySelectorAll('select');
            M.FormSelect.init(elems, {});
        });
    }
  
    render() {
        console.log(this.state.stockName)
        return (
        <div className="container-fluid">
            <div className="row">
                <div 
                    className="input-field col s12 m6 l6 xl6">
                        <i className="material-icons prefix">label</i>
                        <input onChange={(e) => this.handleThaiCategoryNameChange(e)} id={keyLabel[0]} type="text" className="validate"/>
                        <label htmlFor={keyLabel[0]}>{keyLabel[0]}</label>
                </div>
                <div 
                    className="input-field col s12 m6 l6 xl6">
                        <i className="material-icons prefix">label</i>
                        <input onChange={(e) => this.handleEngCategoryNameChange(e)} id={keyLabel[1]} type="text" className="validate"/>
                        <label htmlFor={keyLabel[1]}>{keyLabel[1]}</label>
                </div>
                <div className="input-field col s12 m6 l6 xl6">
                    <select onChange={(e) => this.handleStockNameChange(e)}>
                        <option value="1">Option 1</option>
                        <option value="2">Option 2</option>
                        <option value="3">Option 3</option>
                    </select>
                    <label>Materialize Select</label>
                </div>
            </div>
        </div>
        )
    }
}

export default CategoryNewPage
