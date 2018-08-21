import React, { Component } from 'react'
import M from 'materialize-css'

const marginForInput = {
    marginTop: "25px",
    marginLeft: "25px"
}

export class NewCategoryDropdown extends Component {
    componentDidMount = () => {
        var elems = document.querySelectorAll('.dropdown-trigger');
        M.Dropdown.init(elems, {});
    }
    
    render() {
        return (
            <div>
                <div 
                    className="input-field col s8"
                    style={marginForInput}>
                    <a className='dropdown-trigger btn' data-target='dropdown1'>Drop Me!</a>
                </div>

                <ul id='dropdown1' className='dropdown-content'>
                    <li><a>one</a></li>
                    <li><a>two</a></li>
                </ul>
            </div>
            
        )
    }
}

export default NewCategoryDropdown
