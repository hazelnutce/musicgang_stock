import React, { Component } from 'react'
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom'

import M from 'materialize-css'

export class ViewHeader extends Component {
    static defaultProps = {
        headerTopic: 'ดูรายละเอียด'
    }

    componentDidMount = () => {
        var elems = document.querySelectorAll(`#deleteModal`);
        M.Modal.init(elems, {
            opacity: 0.6
        }); 
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
                    <div data-target="deleteModal" className="waves-effect waves-light btn-small white modal-trigger" style={{top: "10px", postion: "relative"}}><span className="black-text"><i className="material-icons right">delete</i>ลบ</span></div>
                    
                </div>
                
                <div id={"deleteModal"} className="modal">
                        <div className="modal-content">
                            <h4>ยืนยันการลบ</h4>
                            <p>คุณต้องการจะลบรายการห้องซ้อมนี้ใช่หรือไม่ ?</p>
                        </div>
                        <div className="modal-footer">
                            <button className="green modal-close waves-effect waves-light btn" style={{position: "relative", right: "20px"}}  onClick={() => this.props.deleteRecordMethod(this.props.deletedId, this.props.historyInstance)}><i className="material-icons right">add_circle</i>ยืนยัน</button> 
                            <button className="red modal-close waves-effect waves-light btn"><i className="material-icons right">cancel</i>ยกเลิก</button>
                        </div>
                    </div>
            </div>
        )
    }
}

ViewHeader.propTypes = {
    headerTopic: PropTypes.string,
    editDestination: PropTypes.string,
    editState: PropTypes.object,
    deletedId: PropTypes.string,
}

export default (ViewHeader)
