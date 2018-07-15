import React, { Component } from 'react'

export class Footer extends Component {
  render() {
    return (
     <div className="footer-copyright row">
        <div className="container">
          © {(new Date()).getFullYear()} Musicgang Co,.Ltd
          <a className="grey-text text-lighten-4 right" href="#!">More Links</a>
        </div>
      </div>
    )
  }
}

export default Footer
