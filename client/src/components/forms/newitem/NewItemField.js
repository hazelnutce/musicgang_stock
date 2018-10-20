import React from 'react'

export default ({input,keyLabel,type,icon}) => {
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