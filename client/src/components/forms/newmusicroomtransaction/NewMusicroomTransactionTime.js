import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import M from 'materialize-css'

export class NewMusicroomTransactionTime extends Component {

  constructor(props){
    super(props)

    this.state = {
      timePickerInstance : null
    }
  }

  componentDidMount() {
    var inputField = document.getElementById("time-input-field");

    inputField.addEventListener("keydown", function(event) {
        event.preventDefault();
    });

    inputField.addEventListener("contextmenu", function(event) {
        event.preventDefault();
    });

    const {classNameForInit} = this.props
    var elems = document.querySelectorAll(`.${classNameForInit}`);
    this.setState({timePickerInstance : elems})
    M.Timepicker.init(elems, {
        twelveHour : false,
        onSelect : (hour, minute) => {
            return this.props.input.onChange(hour * 60 + minute)
        },
        container: "div"
    });
  }

  componentDidUpdate(prevProps){
    if(prevProps !== this.props){
      if(this.props.input.value === -1){
        const {classNameForInit} = this.props
        this.mainInput.value = ""
        var elems = document.querySelectorAll(`.${classNameForInit}`);
        this.setState({timePickerInstance : elems})
        M.Timepicker.init(elems, {
            twelveHour : false,
            onSelect : (hour, minute) => {
                return this.props.input.onChange(hour * 60 + minute)
            },
            container: "div"
        });
      }
    }
  }

  render() {
    const {icon, placeholder, classNameForInit, meta: {error}} = this.props
    return (
        <div className="input-field col s12 m4 l3 xl3">
            <i className="material-icons prefix"><FontAwesomeIcon icon={icon}/></i>
            <input ref={(ref) => this.mainInput= ref} type="text" id="time-input-field" placeholder={placeholder} className={classNameForInit} />
            {
                error && 
                <span className="red-text" style={{marginLeft: '45px', fontSize: "11px"}}>
                    {error}
                </span>
            }
        </div>
    )
  }
}

export default NewMusicroomTransactionTime
