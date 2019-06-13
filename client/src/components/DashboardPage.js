import React, { Component } from 'react'
import musicroomTransaction from '../asset/musicTransaction.png'
import costPage from '../asset/costPage.png'
import categoryPage from '../asset/categoryPage.png'
import importExportPage from '../asset/importExportPage.png'
import stockPage from '../asset/stockPage.png'
import {Link} from 'react-router-dom'

const mainFeatureName = [
  "คลังสินค้า",
  "หมวดหมู่สินค้า",
  "นำเข้า-นำออกสินค้า",
  "บันทึกห้องซ้อม",
  "บันทึกค่าใช้จ่ายคลังสินค้า"
]

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
          <div className="col xl4 l4 m4 s6">
            <div className="card red lighten-2">
              <div className="card-image waves-effect waves-block waves-light">
                <img className="activator" src={stockPage} alt=""/>
              </div>
              <div className="card-content">
                <span className="card-title activator grey-text text-darken-4">{mainFeatureName[0]}<i className="material-icons right">more_vert</i></span>
                <Link to="/stocks" className="black-text">Go</Link>
              </div>
              <div className="card-reveal">
                <span className="card-title grey-text text-darken-4">{mainFeatureName[0]}<i className="material-icons right">close</i></span>
                <p>รวบรวมคลังสินค้าของระบบ โดยสามารถเก็บรายละเอียดสินค้าต่างๆ เช่น ราคาต้นทุน, สินค้าคงคลัง, อื่นๆ ไว้ในคลังสินค้า</p>
              </div>
            </div>
          </div>

          <div className="col xl4 l4 m4 s6">
            <div className="card orange lighten-2">
              <div className="card-image waves-effect waves-block waves-light">
              <img className="activator" src={categoryPage} alt=""/>
              </div>
              <div className="card-content">
                <span className="card-title activator grey-text text-darken-4">{mainFeatureName[1]}<i className="material-icons right">more_vert</i></span>
                <Link to="/categories" className="black-text">Go</Link>
              </div>
              <div className="card-reveal">
                <span className="card-title grey-text text-darken-4">{mainFeatureName[1]}<i className="material-icons right">close</i></span>
                <p>สร้างหมวดหมู่สินค้าให้แก่สินค้าต่างๆ เพื่อจำแนกประเภทสินค้าและทำให้การค้นหาสินค้าง่ายขึ้น รวมไปถึงการทำข้อมูลเชิงสถิติในภายภาคหน้า (future release)</p>
              </div>
            </div>
          </div>

          <div className="col xl4 l4 m4 s6">
            <div className="card yellow lighten-2">
              <div className="card-image waves-effect waves-block waves-light">
              <img className="activator" src={importExportPage} alt=""/>
              </div>
              <div className="card-content">
                <span className="card-title activator grey-text text-darken-4">{mainFeatureName[2]}<i className="material-icons right">more_vert</i></span>
                <Link to="/transactions" className="black-text">Go</Link>
              </div>
              <div className="card-reveal">
                <span className="card-title grey-text text-darken-4">{mainFeatureName[2]}<i className="material-icons right">close</i></span>
                <p>รวบรวมการเพิ่มหรือลดของสินค้าในแต่ละคลังสินค้าได้ โดยสามารถบันทึกชื่อสินค้า วันที่ของรายการ และคำนวณตัวเลขต่างๆของรายการนั้นๆ</p>
              </div>
            </div>
          </div>

          <div className="col xl4 l4 m4 s6">
            <div className="card light-green lighten-2">
              <div className="card-image waves-effect waves-block waves-light">
              <img className="activator" src={musicroomTransaction} alt=""/>
              </div>
              <div className="card-content">
                <span className="card-title activator grey-text text-darken-4">{mainFeatureName[3]}<i className="material-icons right">more_vert</i></span>
                <Link to="/musicrooms" className="black-text">Go</Link>
              </div>
              <div className="card-reveal">
                <span className="card-title grey-text text-darken-4">{mainFeatureName[3]}<i className="material-icons right">close</i></span>
                <p>[MSG] สามารถลงบันทึกเวลาห้องซ้อม และคำนวณราคาของห้องซ้อม</p>
              </div>
            </div>
          </div>

          <div className="col xl4 l4 m4 s6">
            <div className="card light-blue lighten-2">
              <div className="card-image waves-effect waves-block waves-light">
              <img className="activator" src={costPage} alt=""/>
              </div>
              <div className="card-content">
                <span className="card-title activator grey-text text-darken-4">{mainFeatureName[4]}<i className="material-icons right">more_vert</i></span>
                <Link to="/costs" className="black-text">Go</Link>
              </div>
              <div className="card-reveal">
                <span className="card-title grey-text text-darken-4">{mainFeatureName[4]}<i className="material-icons right">close</i></span>
                <p>รวบรวมค่าใช้จ่ายและรายรับของแต่ละคลังสินค้า โดยเก็บแบ่งเป็นรายเดือน ซึ่งจะนำรายรับร่ายจ่ายของการเพิ่มหรือลดสินค้าที่คำนวณในแต่ละเดือนด้วย</p>
              </div>
            </div>
          </div>
          
         </div>
      </div>
    )
  }
}

export default DashboardPage
