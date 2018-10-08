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
                <div className="nav-wrapper amber darken-1">
                    <ul className="left">
                        <li><Link to="" data-target="slide-out" className="button-collapse sidenav-trigger"><i className="material-icons medium">menu</i></Link></li>
                        <li><a onClick={() => this.props.history.goBack()}><i className="material-icons medium">keyboard_backspace</i></a></li>
                        <li><div><Link to="/">Dashboard</Link></div></li>
                    </ul>
                    
                </div>
            </nav> 
            <SidebarMenuContent />
        </div>
    )
  }
}

export default SidebarMenu
