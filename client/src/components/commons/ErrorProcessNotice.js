import React, { Component } from 'react'
import {Link} from 'react-router-dom'

export class ErrorProcessNotice extends Component {
  render() {
    return (
      <div className="container" style={{position: "relative", top: "5px"}}>
        <div className="row">
            <h5>Error Process</h5>
        </div>
        <div className="row">
            <p>พบข้อผิดพลาดบางประการในการเข้าถึงระบบ กรุณากดปุ่มย้อนกลับที่มุมซ้ายหรือ <Link to="/">กลับสู่หน้าแรก</Link></p>
        </div>
      </div>
    )
  }
}

export default ErrorProcessNotice
