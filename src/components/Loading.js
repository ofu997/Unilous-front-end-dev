import React from 'react'
import { connect } from 'react-redux'
import logoB from '../static/svg/logoB.svg'
import logoW from '../static/svg/logoW.svg'

const Loading = (props) => {
    if (props.size === 'small') {
        return (
            <div className="loading-container">
                <img src={logoB} className="loading-logo" alt="loading logo" />
                <h1>loading</h1>
            </div>
        )
    }
    if (props.color === 'white') {
        return (
        <div className="loading-container" style={{color: 'white'}}>
            <div className="navbar-height" />
            <img src={logoW} className="loading-logo-l" alt="loading logo" />
            <h1 className="loading-title">loading</h1>
        </div>
        )
    }
    return (
        <div className="loading-container">
            <div className="navbar-height" />
            <img src={logoB} className="loading-logo-l" alt="loading logo" />
            <h1 className="loading-title">loading</h1>
        </div>
    )
}

//const mapStateToProps = (state) => {
//	return {
        
//	}
//}
export default connect(
    null
)(Loading)