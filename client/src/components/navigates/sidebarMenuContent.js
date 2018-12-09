import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export class SidebarMenuContent extends Component {
  render() {   
    return (
        <ul id="slide-out" className="sidenav">
            <ul style={{top: "30px",position:"relative"}}>
                <li><Link to="/stocks" className="sidenav-close"><i className="material-icons">storage</i>คลังสินค้า</Link></li>
                <li><Link to="/categories" className="sidenav-close"><i><FontAwesomeIcon className="fas fa-lg" icon="tags"/></i>จัดการหมวดหมู่สินค้า</Link></li>
                <li><a href="/api/logout"><i><FontAwesomeIcon className="fas fa-lg" icon="sign-out-alt"/></i>ออกจากระบบ</a></li>
            </ul>  
        </ul>
    )
  }
}

export default SidebarMenuContent
