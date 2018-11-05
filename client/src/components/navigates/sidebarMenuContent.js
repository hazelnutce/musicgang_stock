import React, { Component } from 'react'
import { Link } from 'react-router-dom';

export class SidebarMenuContent extends Component {
  render() {   
    return (
        <ul id="slide-out" className="sidenav">
            <div><a className="sidenav-close" style={{left: "50px",position:"relative"}} ><i className="material-icons right black-text">close</i></a></div>
            <ul style={{top: "30px",position:"relative"}}>
                <li><Link to="/stocks" className="sidenav-close"><i className="material-icons">storage</i>คลังสินค้า</Link></li>
                <li><Link to="/categories" className="sidenav-close"><i className="material-icons">storage</i>จัดการหมวดหมู่สินค้า</Link></li>
                <li><a href="/api/logout"><i className="material-icons">exit_to_app</i>ออกจากระบบ</a></li>
            </ul>  
        </ul>
    )
  }
}

export default SidebarMenuContent
