import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const shiftTop30 = {
    top: "30px",
    position: "relative"
}

const shiftLeftMinus45 = {
    left: "-45px",
    position: "relative"
}

export class SidebarMenuContent extends Component {
  render() {   
    return (
        <ul id="slide-out" className="sidenav">
            <ul style={shiftTop30}>
                <li><Link to="/stocks" className="sidenav-close"><i className="material-icons">storage</i>คลังสินค้า</Link></li>
                <li><Link to="/categories" className="sidenav-close"><i><FontAwesomeIcon className="fas fa-lg" icon="tags"/></i>จัดการหมวดหมู่สินค้า</Link></li>
                <li><Link to="/transactions" className="sidenav-close"><i><FontAwesomeIcon className="fas fa-sm" icon="arrow-up"/></i><i style={shiftLeftMinus45}><FontAwesomeIcon className="fas fa-sm" icon="arrow-down"/></i><span style={{left: "-55px" , position: "relative"}}>{"นำเข้า & นำออก"}</span></Link></li>
                <li><Link to="/musicrooms" className="sidenav-close"><i><FontAwesomeIcon className="fas fa-lg" icon="music"/></i>[MSG] บันทึกห้องซ้อม</Link></li>
                <li><Link to={{ pathname: "/", state: {signal: "logout"} }} className="sidenav-close"><i><FontAwesomeIcon className="fas fa-lg" icon="sign-out-alt"/></i>ออกจากระบบ</Link></li>
            </ul>  
        </ul>
    )
  }
}

export default SidebarMenuContent
