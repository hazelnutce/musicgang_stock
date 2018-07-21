import React, { Component } from 'react'

export class TopbarMenu extends Component {
  render() {
    return (
        <nav className="amber lighten-1">
            <div className="nav-wrapper">
            <a  className="brand-logo">MusicGang</a>
            <ul className="right hide-on-med-and-down">
                <li><a href="/api/logout">Logout</a></li>
            </ul>
            </div>
        </nav>
    )
  }
}

export default TopbarMenu
