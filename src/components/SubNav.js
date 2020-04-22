import React from 'react'
import { connect } from 'react-redux'
import '../static/css/subNav.css'

const SubNav = (props) => {
    const scrollToRef = () => window.scrollTo(0)
    return (
        <div onClick={() => scrollToRef()} className="sub-nav-container">
            
        </div>
    )
}

//const mapStateToProps = (state) => {
//	return {
        
//	}
//}
export default connect(
    null
)(SubNav)