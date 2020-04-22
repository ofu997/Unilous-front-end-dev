import React, { useState } from 'react'
import { connect } from 'react-redux'
import infoIconW from '../static/svg/infoW.svg'
import infoIconB from '../static/svg/infoB.svg'
import '../static/css/inputHeader.css'

const InputHeader = (props) => {
    const [expanded, setExpanded] = useState(false)

    if (!props.info) {
        return <label htmlFor={props.inputFor}><h3 className="info-title-text">{props.title}</h3></label>
    }

    const showInfo = expanded ? {display: 'block'} : {display: 'none'} 
    const colorInfo = props.color === 'white' ?
        {textColor: '#282828', icon: infoIconB} : {textColor: 'white', icon: infoIconW}
    return (
        <div className="form-info-container" style={{color: colorInfo.textColor}}>
            <div className="info-header-container">
                <label htmlFor={props.inputFor}><h3 className="info-title-text">{props.title}</h3></label>
                <img onClick={() => setExpanded(!expanded)} src={colorInfo.icon} className="info-icon" alt="info" />
            </div>
            <div className="info-content" style={showInfo}>
                {props.children}
            </div>
        </div>

    )
}

//const mapStateToProps = (state) => {
//	return {
        
//	}
//}
export default connect(
    null
)(InputHeader)