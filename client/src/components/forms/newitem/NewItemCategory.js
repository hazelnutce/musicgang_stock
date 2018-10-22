import React, { Component } from 'react'
import M from 'materialize-css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export class NewItemCategory extends Component {

    componentDidMount (){
        const {options} = this.props
        var autocompleteData = {}
        options.map(x => autocompleteData[x.categoryName] = null)
        var elem = document.querySelector(".autocomplete");
        var autocompleteOption = {
            data : autocompleteData
        }
        M.Autocomplete.init(elem, autocompleteOption);
    }

  render() {
    const {input,keyLabel,type,icon} = this.props
    return  (
        <div 
            className="input-field col s12 m6 l6 xl6"
            >
                <i className="prefix"><FontAwesomeIcon icon={icon}/></i>
                <input {...input} id={keyLabel} type={type} className="validate autocomplete"/>
                <label htmlFor={keyLabel}>{keyLabel}</label>
        </div>
    )    
  }
}

export default NewItemCategory
