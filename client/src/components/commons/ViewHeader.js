import React, { Component } from 'react'
import PropTypes from 'prop-types';

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
                    <div className="waves-effect waves-light btn-small white" style={{top: "10px", right:"10px", postion: "relative"}}><span className="black-text"><i className="material-icons right">edit</i>แก้ไข</span></div>
                    <div className="waves-effect waves-light btn-small white" style={{top: "10px", postion: "relative"}}><span className="black-text"><i className="material-icons right">delete</i>ลบ</span></div>
                </div>
            </div>
        )
    }
}

ViewHeader.propTypes = {
    headerTopic: PropTypes.string
}

export default ViewHeader
