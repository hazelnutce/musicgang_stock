import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import DayPickerInput from 'react-day-picker/DayPickerInput'

import MomentLocaleUtils, {
    formatDate,
    parseDate,
  } from 'react-day-picker/moment';

const shiftLeft10 = {
    left: "10px",
    position: "relative"
}

export class AddMusicroomTransaction extends Component {
    constructor(props){
        super(props)

        this.state = {
            selectedDay: null,
            allRecordedItem: []
        }
    }

    handleDayChange = (day) => {
        if((day instanceof Date)){
            this.setState({ selectedDay: day })
        }
    }

  render() {
    return (
        <div className="container" style={{position: "relative", top: "5px"}}>
            <div className="row">
                <h6>
                    <i>
                        <FontAwesomeIcon className="fas fa-sm" icon="music"/>
                    </i>
                    <span style={shiftLeft10}>เพิ่มรายการห้องซ้อม</span>
                </h6>
            </div>
            <div className="row">
                <label className="left">วันที่บันทึก</label>
            </div>
            <div className="row" style={{bottom: "35px", position: "relative"}}>
              <DayPickerInput 
                classNames={{
                  container: "input-field col xl6 l8 m8 s12",
                  overlayWrapper: "DayPickerInput-OverlayWrapper",
                  overlay: "DayPickerInput-Overlay"
                }}
                onDayChange={this.handleDayChange} 
                formatDate={formatDate}
                parseDate={parseDate}
                format={"LL"}
                placeholder={`${formatDate(new Date(), 'LL', 'th')}`}
                dayPickerProps={{
                  locale: 'th',
                  localeUtils: MomentLocaleUtils,
                }}
                value={this.state.selectedDay}
              />
            </div>
            <div className="row" style={{bottom: "35px", position: "relative"}}>
                <div className="col xl12 l12 m12 s12">
                    รายการห้องซ้อม
                </div>
                <div className="col xl12 l12 m12 s12">
                    {this.state.allRecordedItem.length === 0 ? 
                    <div className="card-panel yellow darken-1">
                        <span className="white-text">
                        <span><i className="material-icons" style={{marginLeft: "10px",top:"5px",position:"relative"}}>warning</i></span>
                        <span style={{marginLeft: "10px"}}>ไม่มีรายการที่ต้องการบันทึก กรุณาเพิ่มรายการห้องซ้อม</span>
                        </span>
                    </div> : 
                        this.renderRecordedItem()
                    }
                 </div>
            </div>

        </div>
    )
  }
}

export default AddMusicroomTransaction
