import React, { Component } from 'react'

export class MusicroomTransactionTableHeader extends Component {
    render() {
        if(this.props.isDisplayEditingMenu){
            return(
                <>
                    <th>วันที่</th>
                    <th>เวลา</th>
                    <th>จำนวน ชม.</th>
                    <th>ราคา</th>
                    <th></th>
                    <th></th>
                </>
            )
        }
        else{
            return(
                <>
                    <th>วันที่</th>
                    <th>เวลา</th>
                    <th>จำนวน ชม.</th>
                    <th>ราคา</th>
                    <th></th>
                </>
            )
        }
    }
}

export default MusicroomTransactionTableHeader