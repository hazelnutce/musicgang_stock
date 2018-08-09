import React, { Component } from 'react'
import {SidebarMenuContent} from './sidebarMenuContent'
import M from 'materialize-css'
import { Link } from 'react-router-dom';
import './sidebarMenu.css'

export class SidebarMenu extends Component {
    componentDidMount (){
        var elem = document.querySelector(".sidenav");
        var options = {
            edge: "left",
            inDuration: 250,
            draggable: false
        }
        M.Sidenav.init(elem, options);
    }

  render() {
    return (
        <div>
            <nav >
                <div className="nav-wrapper">
                    <a data-target="slide-out" className="button-collapse sidenav-trigger"><i className="material-icons">menu</i></a>
                    <Link to="/"><div style={{fontSize: "20px", position: "relative", left: "20px"}}>Dashboard</div></Link>
                </div>
            </nav> 
            <SidebarMenuContent />
        </div>
    )
  }
}

export default SidebarMenu
