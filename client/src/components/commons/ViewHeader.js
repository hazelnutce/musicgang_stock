import React, { Component } from 'react'
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom'

export class ViewHeader extends Component {
    static defaultProps = {
        headerTopic: 'ดูรายละเอียด'
    }

    render() {
        return (
            <div className="row">
                <div className="col xl3 l4 m4 s6">
                    <h5>{this.props.headerTopic}</h5>
                </div>
                <div className="col xl6 offset-xl3 l6 offset-l2 m6 offset-m2 s6">
                    <Link to={{ pathname: this.props.editDestination,
                        state: this.props.editState}}>
                        <div className="waves-effect waves-light btn-small white" style={{top: "10px", right:"10px", postion: "relative"}}><span className="black-text"><i className="material-icons right">edit</i>แก้ไข</span></div>
                    </Link>
                    <div className="waves-effect waves-light btn-small white" style={{top: "10px", postion: "relative"}}><span className="black-text"><i className="material-icons right">delete</i>ลบ</span></div>
                </div>
            </div>
        )
    }
}

ViewHeader.propTypes = {
    headerTopic: PropTypes.string,
    editDestination: PropTypes.string,
    editState: PropTypes.object
}

export default ViewHeader
