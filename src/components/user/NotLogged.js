import React, { useState } from 'react'
import { connect } from 'react-redux'
import '../../static/css/newUser.css'
import userIcon from '../../static/svg/userW.svg'
import SignIn from './form/SignIn'
import Register from './form/Register'


const NotLogged = (props) => {
    const [userOption, setUserOption] = useState(null)

    const optionStyle = userOption ? 
        userOption === 'sign in' ?
            {signIn: {backgroundColor: '#484848', color: 'white'}, register: null}
            :
            {signIn: null, register: {backgroundColor: '#484848', color: 'white'}}
        : {signIn: null, register: null}

    const formToShow = userOption ? 
        userOption === 'sign in' ?
            <SignIn /> : <Register />
        : null

    const changeOption = (changeTo) => {
        if (userOption === changeTo) {
            setUserOption(null)
        } else {
            setUserOption(changeTo)
        }
    }
    return (
        <div className="user-container NL-user-container">
            <div onClick={() => changeOption('sign in')} className="user-option-container" style={optionStyle.signIn}>
                <h3 className="user-options" style={{paddingRight: '10px'}}>sign in</h3>
            </div>
            <div className="user-options-splitter">
                <div className="user-icon-container">
                    <img src={userIcon} className="user-icon" alt="user" />
                </div>
            </div>
            <div onClick={() => changeOption('register')} className="user-option-container" style={optionStyle.register}>
                <h3 className="user-options" style={{paddingLeft: '10px'}}>register</h3>
            </div>
            {formToShow}
        </div>
    )
}

//const mapStateToProps = (state) => {
//	return {
        
//	}
//}
export default connect(
    null
)(NotLogged)