import React, { Component } from 'react'
import musicroomTransaction from '../asset/musicTransaction.png'

//red lighten-2
//orange lighten-2
//yellow lighten-2
//light-green lighten-2
//light-blue lighten-2

export class DashboardPage extends Component {
  render() {
    console.log(musicroomTransaction)
    return (
      <div className="container" style={{position: "relative", top: "5px"}}>
        <div className="row">
          Welcome to Musicgang Utility Tool V 1.0
        </div>
        <div className="row">
          <div className="col xl4 l4 m6 s6">
            <div className="card red lighten-2">
              <div className="card-image waves-effect waves-block waves-light">
                <img className="activator" src={musicroomTransaction} alt="Logo"/>
              </div>
              <div className="card-content">
                <span className="card-title activator grey-text text-darken-4">Card Title<i className="material-icons right">more_vert</i></span>
                <p><a href="#">This is a link</a></p>
              </div>
              <div className="card-reveal">
                <span className="card-title grey-text text-darken-4">Card Title<i className="material-icons right">close</i></span>
                <p>Here is some more information about this product that is only revealed once clicked on.</p>
              </div>
            </div>
          </div>

          <div className="col xl4 l4 m6 s6">
            <div className="card orange lighten-2">
              <div className="card-image waves-effect waves-block waves-light">
                <img className="activator" src="images/office.jpg" />
              </div>
              <div className="card-content">
                <span className="card-title activator grey-text text-darken-4">Card Title<i className="material-icons right">more_vert</i></span>
                <p><a href="#">This is a link</a></p>
              </div>
              <div className="card-reveal">
                <span className="card-title grey-text text-darken-4">Card Title<i className="material-icons right">close</i></span>
                <p>Here is some more information about this product that is only revealed once clicked on.</p>
              </div>
            </div>
          </div>

          <div className="col xl4 l4 m6 s6">
            <div className="card yellow lighten-2">
              <div className="card-image waves-effect waves-block waves-light">
                <img className="activator" src="images/office.jpg" />
              </div>
              <div className="card-content">
                <span className="card-title activator grey-text text-darken-4">Card Title<i className="material-icons right">more_vert</i></span>
                <p><a href="#">This is a link</a></p>
              </div>
              <div className="card-reveal">
                <span className="card-title grey-text text-darken-4">Card Title<i className="material-icons right">close</i></span>
                <p>Here is some more information about this product that is only revealed once clicked on.</p>
              </div>
            </div>
          </div>

          <div className="col xl4 l4 m6 s6">
            <div className="card light-green lighten-2">
              <div className="card-image waves-effect waves-block waves-light">
                <img className="activator" src="images/office.jpg" />
              </div>
              <div className="card-content">
                <span className="card-title activator grey-text text-darken-4">Card Title<i className="material-icons right">more_vert</i></span>
                <p><a href="#">This is a link</a></p>
              </div>
              <div className="card-reveal">
                <span className="card-title grey-text text-darken-4">Card Title<i className="material-icons right">close</i></span>
                <p>Here is some more information about this product that is only revealed once clicked on.</p>
              </div>
            </div>
          </div>

          <div className="col xl4 l4 m6 s6">
            <div className="card light-blue lighten-2">
              <div className="card-image waves-effect waves-block waves-light">
                <img className="activator" src="images/office.jpg" />
              </div>
              <div className="card-content">
                <span className="card-title activator grey-text text-darken-4">Card Title<i className="material-icons right">more_vert</i></span>
                <p><a href="#">This is a link</a></p>
              </div>
              <div className="card-reveal">
                <span className="card-title grey-text text-darken-4">Card Title<i className="material-icons right">close</i></span>
                <p>Here is some more information about this product that is only revealed once clicked on.</p>
              </div>
            </div>
          </div>
          
         </div>
      </div>
    )
  }
}

export default DashboardPage
