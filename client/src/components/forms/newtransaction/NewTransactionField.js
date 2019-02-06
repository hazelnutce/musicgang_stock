import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export class NewTransactionField extends Component {
  constructor(props){
    super(props)

    this.state = {
      isCheck: false
    }
  }

  handleOnChange(){
    this.setState({isCheck: !this.state.isCheck})
  }

  render() {
    const {haveCheckBox} = this.props
    if(haveCheckBox){
      const {input,keyLabel,type,icon,checkBoxLabel, meta: {touched, error}} = this.props
      return(
        <div>
          <div>
              <label className="input-field col s12 m4 l3 xl3">
                <input type="checkbox" className="filled-in" onChange={() => this.handleOnChange()} checked={this.state.isCheck} />
                <span>{checkBoxLabel}</span>
              </label>
          </div>
          { this.state.isCheck && (
            <div>
              <div className="input-field col s12 m6 l6 xl6" style={{margin: "auto"}}>
                <i className="material-icons prefix"><FontAwesomeIcon icon={icon}/></i>
                <input {...input} id={keyLabel} type={type} autoComplete="off" className="validate"/>
                <label htmlFor={keyLabel}>{keyLabel}</label>
                {
                touched && error && 
                <span className="red-text" style={{marginLeft: '45px'}}>
                    {touched && error}
                </span>
                }        
              </div>
            </div>
            
          )}
          
        </div>
      )
    }
    else{
      const {input,keyLabel,type,icon, meta: {touched, error}} = this.props
      return(
        <div className="input-field col s12 m6 l6 xl6">
            <i className="material-icons prefix"><FontAwesomeIcon icon={icon}/></i>
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
}

export default NewTransactionField
