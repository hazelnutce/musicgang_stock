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

  convertTimeUnitToString(time){
    var hour = this.pad(parseInt(time/60),2).toString()
    var minute = this.pad(parseInt(time%60),2).toString()

    return hour + ":" + minute
  }

  pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }

  doEvent( obj, event ) {
    /* Created by David@Refoua.me */
    event = new Event( event, {target: obj, bubbles: true} );
    return obj ? obj.dispatchEvent(event) : false;
  }

  componentWillReceiveProps(){
    const {classNameForInit} = this.props
    if(this.props.resetSignal !== null && this.props.resetSignal === true){
      if(this.props.input.value === -1){
        let el = document.getElementsByClassName(classNameForInit)
        el[0].value = "";
        this.doEvent( el[0], 'input' );
      }
    }
    if(this.props.editSignal !== null && this.props.editSignal === true){
      if(this.props.input.value !== -1){

        let el = document.getElementsByClassName(classNameForInit)
        el[0].value = this.convertTimeUnitToString(this.props.input.value);
        this.doEvent( el[0], 'input' );
      }
    }
  }

  render() {
    const {icon, placeholder, classNameForInit, meta: {error}} = this.props
    return (
        <div className="input-field col s12 m4 l3 xl3">
            <i className="material-icons prefix"><FontAwesomeIcon icon={icon}/></i>
            <input type="text" id="time-input-field" placeholder={placeholder} className={classNameForInit} />
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
