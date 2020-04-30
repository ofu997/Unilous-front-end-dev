import React from 'react'
import { connect } from 'react-redux'
import '../../static/css/user/user.css'
import NotLogged from '../user/structure/NotLogged'
import Logged from '../user/structure/Logged'


const UserContainer = (props) => {
    const logStateToShow = props.token ? <Logged /> : <NotLogged />
    
    return (
        <div className="user-wrapper">
            {logStateToShow}
        </div>
    )
}

const mapStateToProps = (state) => {
	return {
        token: state.token
	}
}
export default connect(
    mapStateToProps
)(UserContainer)