import React, { useState } from 'react'
import { connect } from 'react-redux'
import UserContainer from './UserContainer'
import plusIcon from '../../static/svg/plusB.svg'
import userIcon from '../../static/svg/userSB.svg'
import bellIconB from '../../static/svg/bellB.svg'
import heartIconB from '../../static/svg/heartB.svg'
import moreIconB from '../../static/svg/moreSB.svg'
import bellIconW from '../../static/svg/bellW.svg'
import heartIconW from '../../static/svg/heartW.svg'
import moreIconW from '../../static/svg/moreW.svg'
import logoIcon from '../../static/svg/logo/logoB.svg'
import hamburgerIcon from '../../static/svg/hamburger.svg'
import searchIconW from '../../static/svg/searchW.svg'
import searchIconB from '../../static/svg/searchSB.svg'
import exitIcon from '../../static/svg/exitB.svg'
import { Link, withRouter } from 'react-router-dom'
import SkillSugg from '../text-field/SkillSugg'
import UserNotifList from '../user/utilities/UserNotifList'
import UserSP from '../user/utilities/UserSP'
import SignIn from '../user/form/SignIn'
import Register from '../user/form/Register'
import { clearToken } from '../../reducers/token'

let NavBar = (props) => {
    const [utilityShown, setUtilityShown] = useState(null)
    const [menuItemShown, setMenuItemShown] = useState(null)

    const changeUtility = (name) => {
        setMenuItemShown(null)
        if (name === utilityShown) setUtilityShown(null)
        else setUtilityShown(name)
    }

    const changeMenuItem = (item) => {
        if (item === menuItemShown) setMenuItemShown(null)
        else setMenuItemShown(item)
    }

    const linkToPush = `/browse/${encodeURIComponent(props.query)}`
    
    const enterQuery = () => {
        props.history.push(linkToPush)
    }

    const handleKeyPress = (event) => {
        if (event.key === 'Enter'){
            enterQuery()
        }
    }

    const onSuggestionClicked = (skill) => {
        const splitQuery = props.query.split(' ')
        const newQuery = splitQuery.length === 1 ? `${skill} ` : `${splitQuery.slice(0, -1).join(' ')} ${skill} `
        props.onQueryChange({target: {value: newQuery}})
    }

    const handleLogout = () => {
        localStorage.clear()
        props.clearToken()
    }

    const menuStyle = menuItemShown ? {borderBottomColor: '#282828'} : null
    
    const pendingNotifStats = props.currentUser && props.currentUser.pendingNotifications > 0 ?
        ['PN-bubble', props.currentUser.pendingNotifications] : [null, null]
    
    const ShowInSubNav = () => {
        const moreItemButton = menuItemShown === 'more' ?
            <img src={moreIconW} onClick={() => changeMenuItem('more')} className="menu-item-selected" alt="more" />
            :
            <img src={moreIconB} onClick={() => changeMenuItem('more')} className="menu-item" alt="more" />
        if (utilityShown === 'menu') {
            if (props.token) {
                // const allItems = [
                //     {name: 'notifications', iconB: bellIconB, iconW: bellIconW},
                //     {name: 'following', iconB: heartIconB, iconW: heartIconW},
                // ]
                const notifItemButton = menuItemShown === 'notifications' ?
                    <div onClick={() => changeMenuItem('notifications')} className="menu-item-selected PN-container">
                        <img src={bellIconW}  className="notification-item" alt={'notifications'} key={`UO${'notifications'}`} />
                        <div className={pendingNotifStats[0]} >{pendingNotifStats[1]}</div>
                    </div>
                    :
                    <div onClick={() => changeMenuItem('notifications')} className="menu-item PN-container">
                        <img src={bellIconB} className="notification-item" alt={'notifications'} key={`UO${'notifications'}`} />
                        <div className={pendingNotifStats[0]} >{pendingNotifStats[1]}</div>
                    </div>
            
                const followingItemButton = menuItemShown === 'following' ? 
                    <img src={heartIconW} onClick={() => changeMenuItem('following')} className="menu-item-selected" alt={'following'} key={`UO${'following'}`} />
                    :
                    <img src={heartIconB} onClick={() => changeMenuItem('following')} className="menu-item" alt={'following'} key={`UO${'following'}`} />
                
    
                return (
                    <div className="nav-bar-sub-container-m" style={menuStyle}>
                        <Link to="/post-form/" onClick={() => changeMenuItem(null)} className="menu-item" style={{padding: 0, margin: 0}}><img src={plusIcon} className="menu-item" alt="add project" /></Link>
                        <Link to={`/user/${props.currentUser.username}`} onClick={() => changeMenuItem(null)} className="menu-item" style={{padding: 0, margin: 0}}><img src={userIcon} className="menu-item" alt="user page" /></Link>
                        {notifItemButton}
                        {followingItemButton}
                        <img src={exitIcon} onClick={() => handleLogout()} className="menu-item" alt="log out" />
                        {moreItemButton}
                    </div>
                )
            }
            const allItems = ['sign in', 'register']
            const modalItemButtons = allItems.map(i => menuItemShown === i ? 
                <h3 onClick={() => changeMenuItem(i)} className="menu-item-selected" key={`MI${i}`} >{i}</h3>
                :
                <h3 onClick={() => changeMenuItem(i)} className="menu-item" key={`MI${i}`} >{i}</h3>
            )
            return (
                <div className="nav-bar-sub-container-m login-bar" style={menuStyle}>
                    {modalItemButtons}
                    {moreItemButton}
                </div>
            )

        }
        return null
    }


    const MenuItemToShow = () => {
        if (menuItemShown === 'sign in') {
            return (
                <div className="menu-modal-container">
                    <SignIn noBG={true} changeMenuItem={changeMenuItem} />
                </div>
            )
        }
        if (menuItemShown === 'register') {
            return (
                <div className="menu-modal-container">
                    <Register noBG={true} changeMenuItem={changeMenuItem} />
                </div>
            )
        }
        if (menuItemShown === 'notifications') {
            return (
                <div className="menu-modal-container">
                    <h2>notifications</h2>
                    <UserNotifList />
                </div>
            )
        }
        if (menuItemShown === 'following') {
            return (
                <div className="menu-modal-container">
                    <h2>saved posts</h2>
                    <UserSP />
                </div>
            )
        }
        if (menuItemShown === 'more') {
            return (
                <div className="menu-modal-container">
                    <Link to="/contact/" className="neutralize-link"><h1 className="more-link">contact us</h1></Link>
                </div>
            )
        }
        return null
    }
    const showWhenSB = utilityShown === 'search' ? {display: 'block'} : {display: 'none'}
    const alertBarStyle = props.alertNotif.color ?
        {backgroundColor: props.alertNotif.color, color: props.alertNotif.textColor}
        :
        {display: 'none', backgroundColor: props.alertNotif.color, color: props.alertNotif.textColor}
    

    
    return (
        <div>
            <div className="nav-container HWM">
                <div className="nav-bar-container">
                    <Link to="/" className="icon-container" >
                        <img src={logoIcon} alt="icon" className="nav-bar-icon" />
                    </Link>
                    <div className="search-bar">
                        <Link to={linkToPush} className="neutralize-link enter-search search-hover" onClick={() => enterQuery()}>
                            <img src={searchIconW} className="search-icon" alt="search" />
                        </Link>
                        <div className="search-hr" style={{backgroundColor: 'white'}} />
                        <input value={props.query} className="search-input" type="text" onChange={(e) => props.onQueryChange(e)} onKeyPress={(e) => handleKeyPress(e)} placeholder="search or enter nothing for all results" />
                        <div className="SB-separator" />
                        <SkillSugg query={props.query} onSuggestionClicked={onSuggestionClicked} />
                    </div>
                    <UserContainer />
                </div>
                <div className="alert-bar-container" style={{backgroundColor: props.alertNotif.color, color: props.alertNotif.textColor}}>
                    {props.alertNotif.message}
                </div>
            </div>
            <div className="nav-container-m SWM">
                <div className="nav-bar-container-m">
                    <Link to="/" className="NB-brand neutralize-link">
                        <img src={logoIcon} className="NB-logo" alt="logo" />
                        <h2>Unilous</h2>
                    </Link>
                    <div className="NB-primary-utilities">
                        <img src={searchIconB} onClick={() => changeUtility('search')} className="PU-search" alt="search" />
                        <div onClick={() => changeUtility('menu')} className="PU-hamburger-container PN-container">
                            <img src={hamburgerIcon} className="PU-hamburger" alt="menu" />
                            <div className={`${pendingNotifStats[0]} PN-bubble-hamburger`}>{pendingNotifStats[1]}</div>
                        </div>
                    </div>
                </div>
                <div className="alert-bar-container" style={alertBarStyle}>
                    {props.alertNotif.message}
                </div>
                <div className="nav-bar-sub-container" style={showWhenSB}>
                    <div className="search-bar">
                        <Link to={linkToPush} className="neutralize-link enter-search search-hover" onClick={() => enterQuery()}>
                            <img src={searchIconW} className="search-icon" alt="search" />
                        </Link>
                        <div className="search-hr" style={{backgroundColor: 'white', height: '0'}} />
                        <input value={props.query} className="search-input" type="text" onChange={(e) => props.onQueryChange(e)} onKeyPress={(e) => handleKeyPress(e)} placeholder="search or enter nothing for all results" />
                        <SkillSugg query={props.query} onSuggestionClicked={onSuggestionClicked} />
                    </div>
                </div>
                <ShowInSubNav />
                <MenuItemToShow />
            </div>
        </div>
    )
}

NavBar = withRouter(NavBar)

const mapStateToProps = (state) => {
	return {

        currentUser: state.currentUser,
        token: state.token,
        alertNotif: state.alertNotif
	}
}
export default connect(
    mapStateToProps,
    { clearToken }
)(NavBar)