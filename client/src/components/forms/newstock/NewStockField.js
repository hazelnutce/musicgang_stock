import React from 'react'

const marginForInput = {
    marginTop: "25px",
    marginLeft: "25px"
}

export default ({input,keyLabel,type,icon, meta: {error,touched}}) => {
    return(
        <div 
        className="input-field col s5 black-text"
        style={marginForInput}>
            <i className="material-icons prefix">{icon}</i>
            <input {...input} id={keyLabel} type={type} className="validate black-text"/>
            <label htmlFor={keyLabel} className="black-text">{keyLabel}</label>
            {
                touched && error && 
                <div className="red-text" style={{marginBottom: '20px', marginLeft: '45px'}}>
                    {touched && error}
                </div>
            }
            
        </div>
    )
}