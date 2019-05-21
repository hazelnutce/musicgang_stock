import React, {Component} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export class NewCostTransactionField extends Component {
  render() {
     const {input, keyLabel, type, icon, meta: {touched, error} } = this.props
    return(
            <div className="input-field col s12 m6 l6 xl6">
            <i className="prefix"><FontAwesomeIcon icon={icon}/></i>
            <input {...input} id={keyLabel} type={type} autocomplete="off" className="validate"/>
            <label className="active" htmlFor={keyLabel}>{keyLabel}</label>
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

export default NewCostTransactionField

