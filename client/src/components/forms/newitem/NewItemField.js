import React from 'react'

const marginForInput = {
    marginTop: "25px",
    marginLeft: "25px"
}

export default ({input,keyLabel,type,icon}) => {
    return(
        <div 
        className="input-field col s12"
        style={marginForInput}>
            <i className="material-icons prefix">{icon}</i>
            <input {...input} id={keyLabel} type={type} className="validate"/>
            <label htmlFor={keyLabel}>{keyLabel}</label>
        </div>
    )
}