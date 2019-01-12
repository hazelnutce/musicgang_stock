import React from 'react'

export default ({input,keyLabel,type,icon,mode, meta: {touched, error}}) => {
    return(
        <div 
            className="input-field col s12 m6 l6 xl6">
                <i className="material-icons prefix">{icon}</i>
                <input {...input} id={keyLabel} type={type} autoComplete="off" className="validate" />
                <label htmlFor={keyLabel} className={mode === "edit" ? "active" : ""}>{keyLabel}</label>
                {
                    touched && error && 
                    <span className="red-text" style={{marginLeft: '45px'}}>
                        {touched && error}
                    </span>
                }
        </div>
    )
}
