import React, { Component } from 'react'

export class SidebarMenuContent extends Component {
  render() {
    return (
        <ul id="slide-out" className="sidenav">
            <div><a href="#!" className="sidenav-close" style={{left: "50px",position:"relative"}} ><i className="material-icons right black-text">close</i></a></div>
            <ul style={{top: "30px",position:"relative"}}>
                <li><a href="#!">Second Link</a></li>
                <li><a href="/api/logout"><i className="material-icons">exit_to_app</i>Logout</a></li>
            </ul>  
        </ul>
    )
  }
}

export default SidebarMenuContent
