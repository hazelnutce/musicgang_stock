import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import M from 'materialize-css'

export class NewMusicroomTransactionTime extends Component {

  componentDidMount() {
    var elems = document.querySelectorAll('.timepicker');
    M.Timepicker.init(elems, {
        twelveHour : false,
        onSelect : (hour, minute) => {
            console.log(hour,minute)
        },
        container: "div"
    });
  }

  render() {
    const {icon, placeholder} = this.props
    return (
        <div className="input-field col s12 m4 l3 xl3">
            <i className="material-icons prefix"><FontAwesomeIcon icon={icon}/></i>
            <input type="text" placeholder={placeholder} className="timepicker" />
            
        </div>
    )
  }
}

export default NewMusicroomTransactionTime
