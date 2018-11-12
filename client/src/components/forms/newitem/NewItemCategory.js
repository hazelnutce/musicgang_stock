import React, { Component } from 'react'
import M from 'materialize-css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import AutoComplete from 'react-autocomplete'
var elemInstance = null

export class NewItemCategory extends Component {
    
    constructor (props) {
        super(props)
        this.state = {
          value: '',
        }
      }

    componentDidMount (){
        const {options} = this.props
        var autocompleteData = {}
        options.map(x => autocompleteData[x.categoryName] = null)
        var elem = document.querySelector(".autocomplete");
        var autocompleteOption = {
             data : autocompleteData,
             onAutocomplete : () => {
                this.props.input.onChange(elem.value)
             }
        }
        M.Autocomplete.init(elem, autocompleteOption);
        
    }

    render() {
        //console.log(this.props.input)
        const {input,keyLabel,type,icon} = this.props
        return(
            <div 
            className="input-field col s12 m6 l6 xl6"
            >
                <i className="prefix"><FontAwesomeIcon icon={icon}/></i>
                <input {...input} id="autocomplete-input" type={type} className="autocomplete"/>
                <label htmlFor="autocomplete-input">{keyLabel}</label>
            </div>
        )   
    }
}

export default NewItemCategory
