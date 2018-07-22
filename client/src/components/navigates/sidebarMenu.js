import React, { Component } from 'react'
import {SidebarMenuContent} from './sidebarMenuContent'
import M from 'materialize-css'
import './sidebarMenu.css'

export class SidebarMenu extends Component {
    componentDidMount (){
        var elem = document.querySelector(".sidenav");
        console.log(elem)
        M.Sidenav.init(elem, {
            edge: "left",
            inDuration: 250,
            draggable: false
        });
    }

  render() {
    return (
        <div>
            <div className="navbar-fixed">
            <nav >
                <div className="nav-wrapper">
                    <ul className="left hide-on-med-and-down">
                        <li><a data-target="slide-out" className="button-collapse sidenav-trigger"><i className="material-icons">menu</i></a></li>
                        <li><a href="mobile.html">Mobile</a></li>
                    </ul>
                </div>
                <div className="container">hello</div>
            </nav> 
            </div>
            <SidebarMenuContent />
        </div>
    )
  }
}

export default SidebarMenu
