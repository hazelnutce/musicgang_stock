import React, { Component } from 'react'
import M from 'materialize-css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export class NewItemCategory extends Component {
    
    constructor (props) {
        super(props)
        this.state = {
          value: '',
        }
      }

    componentDidMount (){
        const {options} = this.props
        if(options != null){
            var autocompleteData = {}
            options.map(x => autocompleteData[`${x.categoryNameTh}(${x.categoryNameEn})`] = null)
            var elem = document.querySelector(".autocomplete");
            var autocompleteOption = {
                data : autocompleteData,
                onAutocomplete : () => {
                    this.props.input.onChange(elem.value)
                }
            }
            M.Autocomplete.init(elem, autocompleteOption);
        }

    }

    render() {
        const {input,keyLabel,type,icon,meta: {touched, error}} = this.props
        return(
                <div className="input-field col s12 m6 l6 xl6">
                    <i className="prefix"><FontAwesomeIcon icon={icon}/></i>
                    <input {...input} id="autocomplete-input" autoComplete="off" type={type} className="autocomplete validate"/>
                    <label className="active" htmlFor="autocomplete-input">{keyLabel}</label>
                    {
                    touched && error && 
                    <span className="red-text" style={{marginLeft: '45px'}}>
                        {touched && error}
                    </span>
                    }  
                </div>      
        )   
    }
}

export default NewItemCategory
