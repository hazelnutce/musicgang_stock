import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default ({input,keyLabel,type,icon,faRequire, meta: {touched, error}}) => {
    if(faRequire){
        return(
                 <div className="input-field col s12 m6 l6 xl6">
                    <i className="prefix"><FontAwesomeIcon icon={icon}/></i>
                    <input {...input} id={keyLabel} type={type} autoComplete="off" className="validate"/>
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
    else{
        return(
                <div className="input-field col s12 m6 l6 xl6">
                    <i className="material-icons prefix">{icon}</i>
                    <input {...input} id={keyLabel} type={type} autoComplete="off" className="validate"/>
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