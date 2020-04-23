import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { useQuery } from '@apollo/react-hooks'
import { FIND_USER } from '../../schemas'
import userIcon from '../../static/svg/userW.svg'
import { setCurrentUser } from '../../reducers/currentUser'
import { Link } from 'react-router-dom'
import { clearToken } from '../../reducers/token'
import exitIcon from '../../static/svg/exitB.svg'
import plusIcon from '../../static/svg/plusB.svg'
import userIconSB from '../../static/svg/userSB.svg'
import bellIconB from '../../static/svg/bellB.svg'
import heartIconB from '../../static/svg/heartB.svg'
import userIconW from '../../static/svg/userW.svg'
import bellIconW from '../../static/svg/bellW.svg'
import heartIconW from '../../static/svg/heartW.svg'
import UserNotifList from './utilities/UserNotifList'
import UserSP from './utilities/UserSP'
import '../../static/css/userUtilities.css'

const Logged = (props) => {
    const [showUtilities, setShowUtilities] = useState(true)
    const [utilityShown, setUtilityShown] = useState('')

    const userQuery = useQuery(FIND_USER, {
        variables: {username: localStorage.getItem('username')}
    })
    const userQueryConditions = () => {
        const query = userQuery.data
        const reducer = props.currentUser
        if (!query) { return null }
        if (!query.findUser) { return null }
        if (reducer) {
            if (query.findUser.username === reducer.username) { return null }
        }
        return query
    }
    const userResult = userQueryConditions()

    useEffect(() => {
        if (userResult) {
            props.setCurrentUser(userResult)
        }
    }, [props, props.currentUser, userResult])

    if (!props.currentUser) {
        return (
            <div className="user-container LGD-user-container">
                <div className="user-options-splitter">
                    <div className="user-icon-container">
                        {/* <img src={userIcon} className="user-icon" alt="user" /> */}
                    </div>
                </div>
                <div className="user-banner">
                </div>
            </div>
        )
    }
    
    const logout = () => {
        localStorage.clear()
        props.clearToken()
    }

    const changeUtilityShown = (changeTo) => {
        if (changeTo === utilityShown) {
            setUtilityShown(null)
        }
        else {
            setUtilityShown(changeTo)
        }
        setShowUtilities(true)
    }
    const changeShowUtilities = (changeTo) => {
        if (!changeTo) {
            setShowUtilities(changeTo)
            setUtilityShown(null)
        }
        else {
            setShowUtilities(changeTo)
        }
    }

    const usernameIcon = props.currentUser.username.substr(0, 1).toUpperCase()

    const iconToShow = showUtilities ?
        <Link to={`/user/${encodeURIComponent(props.currentUser.username)}`} className="user-icon-container UICH neutralize-link">
            <h1 className="user-username-icon user-icon-hover">{usernameIcon}</h1>
        </Link>
        :
        <Link to={`/user/${encodeURIComponent(props.currentUser.username)}`} className="user-icon-container UICH">
            <img src={userIcon} className="user-icon user-icon-hover" alt="user" />
        </Link>

    const basicStyles = {user: {className: '', icon: userIconSB}, notifications: {className: '', icon: bellIconB}, following: {className: '', icon: heartIconB}}
    if (utilityShown === 'user') { basicStyles.user = {className: 'UUO-selected', icon: userIconW}}
    if (utilityShown === 'notifications') { basicStyles.notifications = {className: 'UUO-selected', icon: bellIconW}}
    if (utilityShown === 'following') { basicStyles.following = {className: 'UUO-selected', icon: heartIconW}}
    
    const pendingNotifStats = props.currentUser && props.currentUser.pendingNotifications > 0 ?
        ['PN-bubble', props.currentUser.pendingNotifications] : [null, null]

    const showInBanner = showUtilities ?
        <React.Fragment>
            <Link to="/post-form/" className="UU-add-post user-utility-option neutralize-link" style={{gridColumn: '1/3'}}>
                <img src={plusIcon} className="UUAP-icon" alt="add post"/>
                <h4 className="UUAP-text">add post</h4>
            </Link>
            <Link to={`/user/${props.currentUser.username}`} className={`user-utility-option ${basicStyles.user.className}`}>
                <img src={basicStyles.user.icon} className="UU-icon" alt="user" />
            </Link>
            <div onClick={() => changeUtilityShown('notifications')} className={`user-utility-option PN-container ${basicStyles.notifications.className}`}>
                <img src={basicStyles.notifications.icon} className="UU-icon" alt="notifications" />
                <div className={pendingNotifStats[0]}>{pendingNotifStats[1]}</div>
            </div>
            <div onClick={() => changeUtilityShown('following')} className={`user-utility-option ${basicStyles.following.className}`}>
                <img src={basicStyles.following.icon} className="UU-icon" alt="follow" />
            </div>
            <div onClick={() => logout()} className="user-utility-option UU-logout">
                <img src={exitIcon} className="UU-logout-icon" alt="log out" />
            </div>
        </React.Fragment>
        :
        <div onClick={() => changeShowUtilities(!showUtilities)} className="user-username-container SUH"><h2 className="user-username">{props.currentUser.username}</h2></div>

    const showBubble = showUtilities ?
        <div />
        :
        <div onClick={() => changeUtilityShown('notifications')} className="user-notification-bubble">4</div>


    const showUtilityContent = utilityShown ? 
        {display: 'block'} : {display: 'none'}

    const utilityContent = () => {
        // if (utilityShown === 'user') {
        //     return <div><UserInfo /></div>
        // }
        if (utilityShown === 'notifications') {
            return <UserNotifList />
        }
        if (utilityShown === 'following') {
            return <UserSP />
        }
        return null
    }
    
    return (
        <div className="user-container LGD-user-container">
            <div className="user-options-splitter">
                {iconToShow}
            </div>
            <div className="user-banner">
                {showInBanner}
            </div>
            {showBubble}
            <div className="UU-utilities-splitter" style={showUtilityContent}/>
            <div className="UU-content-container" style={showUtilityContent}>
                <h3>{utilityShown}</h3>
                {utilityContent()}
            </div>
        </div>
    )
}


const mapStateToProps = (state) => {
	return {
        currentUser: state.currentUser
	}
}
export default connect(
    mapStateToProps,
    { clearToken, setCurrentUser }
)(Logged)