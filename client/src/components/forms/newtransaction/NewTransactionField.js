import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export class NewTransactionField extends Component {
  constructor(props){
    super(props)

    this.state = {
      isCheck: false,
      currentValue: ""
    }
  }

  handleOnChange(){
    //false -> true
    if(this.state.isCheck === false){
      this.props.input.onChange(this.state.currentValue)
      this.setState({isCheck: !this.state.isCheck})
    }
    //true -> false
    else{
      this.props.input.onChange("")
      this.setState({isCheck: !this.state.isCheck, currentValue: this.props.input.value})
    }
    
  }

  handleActiveLabel(){
    return this.props.input.value !== "" ? "active" : ""
  }

  componentWillReceiveProps(prevProps){
    if(this.props.resetSignal !== prevProps.resetSignal){
      if(this.props.resetSignal !== null && this.props.resetSignal === true){
        this.setState({isCheck: false})
      }
    }
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
              <div className="input-field col s12 m8 l9 xl9" style={{margin: "auto"}}>
                <i className="material-icons prefix"><FontAwesomeIcon icon={icon}/></i>
                <input {...input} id={keyLabel} type={type} autoComplete="off" className="validate"/>
                <label htmlFor={keyLabel} className={this.handleActiveLabel()}>{keyLabel}</label>
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
            <label htmlFor={keyLabel} className={this.handleActiveLabel()}>{keyLabel}</label>
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
