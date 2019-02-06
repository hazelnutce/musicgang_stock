import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import M from 'materialize-css'

export class NewTransactionItem extends Component {
    constructor (props) {
        super(props)
        this.state = {
            value: '',
        }
    }

    componentDidMount (){
        const {items} = this.props
        if(items != null){
            var autocompleteData = {}
            items.map(x => autocompleteData[`${x.itemName}`] = null)
            var elem = document.querySelector(".autocomplete");
            var autocompleteOption = {
                data : autocompleteData,
                limit : 4,
                onAutocomplete : () => {
                    this.props.input.onChange(elem.value)
                }
            }
            M.Autocomplete.init(elem, autocompleteOption);
        }

    }

  render() {
    const {input,keyLabel,type,icon,meta: {touched, error}} = this.props
    return (
         <div className="input-field col s12 m6 l6 xl6">
            <i className="prefix"><FontAwesomeIcon icon={icon}/></i>
            <input {...input} id="autocomplete-input" autoComplete="off" type={type} className="autocomplete validate"/>
            <label htmlFor="autocomplete-input">{keyLabel}</label>
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

export default NewTransactionItem
