import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { useQuery } from '@apollo/react-hooks'
import { LIST_OF_NOTIFICATIONS } from '../../../schemas'
import { setCurrentUserNotifications } from'../../../reducers/currentUser'
import NewUserNotif from './NewUserNotif'
import Loading from '../../Loading'



const UserNotifList = (props) => {
    const notifsListQuery = useQuery(LIST_OF_NOTIFICATIONS, {
        variables: {notifications: props.currentUser.notifications.map(n => n._id)}
    })

    const [sentFilter, setSentFilter] = useState('to you')
    const [showSFDD, setShowSFDD] = useState(false)
    const [statusFilter, setStatusFilter] = useState('pending')
    const [showStatusDD, setShowStatusDD] = useState(false)

    const notifsListConditions = (query, reducer) => {
        if (!query) { return null }
        if (reducer.length === 0) { return null }
        if (reducer[0].userTo) {
            if (query[0]._id === reducer[0]._id ) { return null }
        }
        return query
    }
    

    const notifsList = notifsListConditions(notifsListQuery.data.listOfNotifications, props.currentUser.notifications)

    useEffect(() => {
        if (notifsList) {
            props.setCurrentUserNotifications(notifsList)
        }
    }, [notifsList, props, props.setCurrentUserNotifications])

    if (props.currentUser.notifications.length > 0) {
        if (!props.currentUser.notifications[0].userTo) {
            return (
                <div style={{gridColumn: '1/3'}}>
                    <div style={{height: '5vh'}}/>
                    <Loading color="white" />
                </div>
            )
        }
    }

    const Filter = () => {
        const sentOptions = () => {
            const allOptions = ['from you', 'to you']
            const onOptionClick = (option) => {
                setSentFilter(option)
                setShowSFDD(!showSFDD)
            }
            return allOptions.map(o => o !== sentFilter ? <div onClick={() => onOptionClick(o)} className="NF-DD-option" key={`SFDD${o}`}>{o}</div> : null)
        }
        const sentDD = showSFDD ? (
                <div className="NF-dropdown">
                    <div className="NF-splitter" />
                    {sentOptions()}
                </div>
            ): null

        const statusOptions = () => {
            const allOptions = ['all', 'accepted', 'declined', 'pending', 'messages']
            const onOptionClick = (option) => {
                setStatusFilter(option)
                setShowStatusDD(!showStatusDD)
            }
            return allOptions.map(o => o !== statusFilter ? <div onClick={() => onOptionClick(o)} className={`${o}-option NF-DD-option`} key={`StatusDD${o}`}>{o}</div> : null)
        }
        const statusDD = showStatusDD ? (
                <div className="NF-dropdown">
                    <div className="NF-splitter" />
                    {statusOptions()}
                </div>
            ): null
        return (
            <div className="notif-filter-container">
                <div className="NF-creator-container">
                    <h4 className="NF-label">status</h4>
                    <div className="NF-option-container">
                        <div onClick={() => setShowStatusDD(!showStatusDD)} className={`${statusFilter}-option NF-option`}>{statusFilter}</div>
                        {statusDD}
                    </div>
                </div>
                <div className="NF-creator-container" style={{marginLeft: '15px'}}>
                    <h4 className="NF-label">sent</h4>
                    <div className="NF-option-container">
                        <div onClick={() => setShowSFDD(!showSFDD)} className="NF-option">{sentFilter}</div>
                        {sentDD}
                    </div>
                </div>
            </div>
        )
    }

    const statusConditions = (notif) => {
        if (statusFilter === 'all') return true
        const notifStatus = notif.accepted === null ?
            'pending' : 
            notif.accepted ?
            notif.post ?
                'accepted' : 'messages'
            : 'declined'
        if (statusFilter === notifStatus) return true
        return false
    }
    const sentConditions = (notif) => {
        if (sentFilter === 'all') return true
        const sentStatus = notif.userFrom.username === props.currentUser.username ?
            'from you' : 'to you'
        if (sentFilter === sentStatus) return true
        return false
    }
    const showNotifications = props.currentUser.notifications.map(n => {
        if (statusConditions(n) && sentConditions(n)){
            return <NewUserNotif notif={n} key={`UN${n._id}`}/>
        }
        return null
    }).reverse()
    return (
        <div className="userUtil-notif">
            <Filter />
            <div style={{height: '10px'}} />
            {showNotifications}
            <div style={{height: '10px'}} />
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
    { setCurrentUserNotifications }
)(UserNotifList)