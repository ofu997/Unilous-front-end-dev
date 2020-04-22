import React, { useState } from 'react'
import { connect } from 'react-redux'
import '../static/css/formContainer.css'

const FormContainer = (props) => {
    const [expanded, setExpanded] = useState(false)
    const handleExpand = () => {
        setExpanded(!expanded)
    }
    const setBC = {backgroundColor: props.pallette.color}
    if (expanded) {
        return (
            <div className="form-container" style={{border: `3px solid ${props.pallette.color}`}}>
                <div onClick={() => handleExpand()} className="form-contract standard-hover" style={setBC} title="contract">
                    <img className="form-shrink-icon" src={props.pallette.shrinkIcon} alt="team up" />
                </div>
                {props.children}
            </div>
        )
    }
    return (
        <div onClick={() => handleExpand()} className="form-container-expand standard-hover" style={setBC} title={props.setTitle}>
            <img className="form-expand-icon" src={props.icon} alt="team up" />
        </div>
    )
}

//const mapStateToProps = (state) => {
//	return {
        
//	}
//}
export default connect(
    null
)(FormContainer)