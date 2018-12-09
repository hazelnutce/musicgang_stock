import React, { Component } from 'react'
import {SidebarMenuContent} from './sidebarMenuContent'
import M from 'materialize-css'
import { Link } from 'react-router-dom';
import './sidebarMenu.css'
import '../commons/linkButton.css'

export class SidebarMenu extends Component {
    componentDidMount (){
        var sideNavElem = document.querySelector(".sidenav")
        var sideNavOptions = {
            edge: "left",
            inDuration: 250,
            draggable: false
        }
        M.Sidenav.init(sideNavElem, sideNavOptions)
    }

  render() {
    return (
        <div>
            <nav >
                <div className="nav-wrapper amber darken-1">
                    <ul className="left">
                        <li><Link to="" data-target="slide-out" className="button-collapse sidenav-trigger"><i className="material-icons medium">menu</i></Link></li>
                        <li><Link to="" className="link-button" onClick={() => this.props.history.goBack()}><i className="material-icons medium">keyboard_backspace</i></Link></li>
                        <li><div><Link to="/">หน้าแรก</Link></div></li>
                    </ul>
                    <ul className="right">
                    </ul>
                    
                </div>
            </nav> 
            <SidebarMenuContent />
        </div>
    )
  }
}

export default SidebarMenu
