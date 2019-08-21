import React, { Component } from 'react'
import PropTypes from 'prop-types';
import _ from 'lodash'

export class ViewGeneralBody extends Component {
    renderParagraph = () => {
        return _.map(this.props.arraySubTopicHeader, (header, index) => {
            return <span key={index}>{header} : {this.props.arraySubTopicData[index]} <br/></span>
        })
    }

    render() {
        return (
            <div className="row">
                <p style={{top: "20px", left: "20px", position: "relative"}}>
                    {this.renderParagraph()}
                </p>
                <div className="divider" style={{top: "20px", left: "20px", position: "relative"}}></div>
            </div>
        )
    }
}

ViewGeneralBody.propTypes = {
    arraySubTopicHeader: PropTypes.array,
    arraySubTopicData: PropTypes.array
}

export default ViewGeneralBody
