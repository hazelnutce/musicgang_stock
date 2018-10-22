import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default ({input,keyLabel,type,icon,faRequire}) => {
    if(faRequire){
        return(
            <div 
            className="input-field col s12 m6 l6 xl6"
            >
                <i className="prefix"><FontAwesomeIcon icon={icon}/></i>
                <input {...input} id={keyLabel} type={type} className="validate"/>
                <label htmlFor={keyLabel}>{keyLabel}</label>
            </div>
        )
    }
    else{
        return(
            <div 
            className="input-field col s12 m6 l6 xl6"
            >
                <i className="material-icons prefix">{icon}</i>
                <input {...input} id={keyLabel} type={type} className="validate"/>
                <label htmlFor={keyLabel}>{keyLabel}</label>
            </div>
        )
    }
    
}