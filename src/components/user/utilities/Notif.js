import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import userIcon from '../../../static/svg/userB.svg'
import PostSmall from '../../post/PostSmall'
import { useMutation } from '@apollo/react-hooks'
import { ACCEPT_NOTIFICATION, DECLINE_NOTIFICATION, ANSWER_QUESTION } from '../../../schemas/mutations'
import { setCurrentUserNotifications } from '../../../reducers/currentUser'
import { setAlert, resetAlert } from '../../../reducers/alertNotif'
import { useField, websiteStats, triggerAlert } from '../../../functions/functions'
import '../../../static/css/notifs.css'

const Notif = (props) => {
    const handleError = (e) => {
        console.log(e)
    }

    const [acceptNotif] = useMutation(ACCEPT_NOTIFICATION, {
        onError: handleError
    })
    const [declineNotif] = useMutation(DECLINE_NOTIFICATION, {
        onError: handleError
    })
    const [answerQuestion] = useMutation(ANSWER_QUESTION, {
        onError: handleError
    })

    const answer = useField('text')

    const handleAnswer = async () => {
        const result = await answerQuestion({
            variables: {
                notificationId: props.notif._id,
                response: answer.fields.value
            }
        })
        if (result) {
            const newNotifications = props.currentUser.notifications.map(n => n._id === props.notif._id ? result.data.answerQuestion : n)
            props.setCurrentUserNotifications(newNotifications)
            answer.reset()
            triggerAlert('success', `replied$: you have replied to ${props.notif.userFrom.username}'s question`, props.setAlert, props.resetAlert)
        }

    }

    const handleAccept = async () => {
        const accept = await acceptNotif({
            variables: {notificationId: props.notif._id}
        })
        if (accept) {
            const newNotifications = props.currentUser.notifications.map(n => n._id === props.notif._id ? accept.data.acceptNotification : n)
            props.setCurrentUserNotifications(newNotifications)
            triggerAlert('success', `accepted$: you have accepted ${props.notif.userFrom.username} to your team`, props.setAlert, props.resetAlert)
        }
    }
    const handleDecline = async () => {
        const decline = await declineNotif({
            variables: {notificationId: props.notif._id}
        })

        if (decline) {
            const newNotifications = props.currentUser.notifications.map(n => n._id === props.notif._id ? decline.data.declineNotification : n)
            props.setCurrentUserNotifications(newNotifications)
            triggerAlert('danger', `declined$: you have declined ${props.notif.userFrom.username}'s request to join`, props.setAlert, props.resetAlert)
        }
    }
    
    const notif = props.notif
    const notifStatusColor = notif.accepted === null ? 
        'rgb(226,184,59)' :
        notif.accepted ?
            notif.post ?
                'rgb(52,166,95)' : '#8b8b8b' 
            : 'rgb(254,52,77)'
    if (notif.userFrom.username === props.currentUser.username){
        if (notif.accepted) {
            if(notif.question) {
                return (
                    <div className="n-notif-container" style={{borderBottom: `5px solid ${notifStatusColor}`}}>
                        <h3 className="n-notif-header" style={{backgroundColor: notifStatusColor}}>sent question</h3>
                        <Link to={`/user/${notif.userTo.username}`} className="n-notif-user neutralize-link">
                            <div className="NU-label">to:</div>
                            <img src={userIcon} className="NU-icon" alt='user' />
                            <div className="NU-username">{notif.userTo.username}</div>
                        </Link>
                        <PostSmall post={notif.post} user={notif.userTo.username} style={{margin: 0, padding: 0}} />
                        <div className="n-notif-content-secondary">
                            <h3 className="n-notif-title" style={{marginLeft: '15px'}}>question</h3>
                            <p className="n-notif-message">{notif.question}</p>
                        </div>
                        <div className="n-notif-content-primary">
                            <h3 className="n-notif-title" style={{marginLeft: '15px'}}>answered</h3>
                            <p className="n-notif-message">{notif.answer}</p>
                        </div>
                    </div>
                )
            }
            if (notif.post) {
                const GCLinkStats = websiteStats(notif.post.contactLink)
                const cleanedLink = notif.post.contactLink.split('/')[2]
                const skillToJoin = notif.post.skillNames[notif.proposedContribution.indexOf(1)]
                return (
                    <div className="n-notif-container" style={{borderBottom: `5px solid ${notifStatusColor}`}}>
                        <h3 className="n-notif-header" style={{backgroundColor: notifStatusColor}}>sent join request</h3>
                        <Link to={`/user/${notif.userTo.username}`} className="n-notif-user neutralize-link">
                            <div className="NU-label">to:</div>
                            <img src={userIcon} className="NU-icon" alt='user' />
                            <div className="NU-username">{notif.userTo.username}</div>
                        </Link>
                        <PostSmall post={notif.post} user={notif.userTo.username} />
                        <div className="n-notif-STJ-container">
                            <div className="n-notif-STJ">skill to join: <strong>{skillToJoin}</strong></div>
                        </div>
                        <div className="n-notif-content-secondary">
                            <p className="n-notif-message">{notif.message}</p>
                        </div>
                        <h3 className="n-notif-title" style={{marginLeft: '15px'}}>group/contact link</h3>
                        <div className="n-button-container">
                            <a href={notif.post.contactLink} className="n-join-link n-SH" style={{backgroundColor: GCLinkStats.color}}>
                                <img src={GCLinkStats.icon} className="n-JL-icon" alt={GCLinkStats.title}/>
                                <h3>{cleanedLink}</h3>
                            </a>
                        </div>
                    </div>
                )
            }
            else {
                return (
                    <div className="n-notif-container" style={{borderBottom: `5px solid ${notifStatusColor}`}}>
                        <h3 className="n-notif-header" style={{backgroundColor: notifStatusColor}}>sent message</h3>
                        <Link to={`/user/${notif.userTo.username}`} className="n-notif-user neutralize-link">
                            <div className="NU-label">to:</div>
                            <img src={userIcon} className="NU-icon" alt='user' />
                            <div className="NU-username">{notif.userTo.username}</div>
                        </Link>
                        <div className="n-notif-content-primary">
                            <h3 className="n-notif-title" style={{marginLeft: '15px'}}>message</h3>
                            <p className="n-notif-message">{notif.message}</p>
                        </div>
                    </div>
                )
            }
        }
        if (notif.accepted === null) {
            if(notif.question) {
                return (
                    <div className="n-notif-container" style={{borderBottom: `5px solid ${notifStatusColor}`}}>
                        <h3 className="n-notif-header" style={{backgroundColor: notifStatusColor}}>sent question</h3>
                        <div className="n-notif-user">
                            <div className="NU-label">to:</div>
                            <img src={userIcon} className="NU-icon" alt='user' />
                            <div className="NU-username">{notif.userTo.username}</div>
                        </div>
                        <PostSmall post={notif.post} user={notif.userTo.username} style={{margin: 0, padding: 0}} />
                        <div className="n-notif-content-primary">
                            <h3 className="n-notif-title" style={{marginLeft: '15px'}}>question</h3>
                            <p className="n-notif-message">{notif.question}</p>
                        </div>
                    </div>
                )
            }
            else {
                const skillToJoin = notif.post.skillNames[notif.proposedContribution.indexOf(1)]
                return (
                    <div className="n-notif-container" style={{borderBottom: `5px solid ${notifStatusColor}`}}>
                        <h3 className="n-notif-header" style={{backgroundColor: notifStatusColor}}>sent join request</h3>
                        <Link to={`/user/${notif.userTo.username}`} className="n-notif-user neutralize-link">
                            <div className="NU-label">to:</div>
                            <img src={userIcon} className="NU-icon" alt='user' />
                            <div className="NU-username">{notif.userTo.username}</div>
                        </Link>
                        <PostSmall post={notif.post} user={notif.userTo.username} />
                        <div className="n-notif-STJ-container">
                            <div className="n-notif-STJ">skill to join: <strong>{skillToJoin}</strong></div>
                        </div>
                        <div className="n-notif-content-primary">
                            <p className="n-notif-message">{notif.message}</p>
                        </div>
                    </div>
                )
            }
        }
        else {
            if(notif.question) {
                return (
                    <div className="n-notif-container" style={{borderBottom: `5px solid ${notifStatusColor}`}}>
                        <h3 className="n-notif-header" style={{backgroundColor: notifStatusColor}}>sent question</h3>
                        <div className="n-notif-user">
                            <div className="NU-label">to:</div>
                            <img src={userIcon} className="NU-icon" alt='user' />
                            <div className="NU-username">{notif.userTo.username}</div>
                        </div>
                        <PostSmall post={notif.post} user={notif.userTo.username} style={{margin: 0, padding: 0}} />
                        <div className="n-notif-content-primary">
                            <h3 className="n-notif-title" style={{marginLeft: '15px'}}>question</h3>
                            <p className="n-notif-message">{notif.question}</p>
                        </div>
                    </div>
                )
            }
            else {
                const skillToJoin = notif.post.skillNames[notif.proposedContribution.indexOf(1)]
                return (
                    <div className="n-notif-container" style={{borderBottom: `5px solid ${notifStatusColor}`}}>
                        <h3 className="n-notif-header" style={{backgroundColor: notifStatusColor}}>sent join request</h3>
                        <Link to={`/user/${notif.userTo.username}`} className="n-notif-user neutralize-link">
                            <div className="NU-label">to:</div>
                            <img src={userIcon} className="NU-icon" alt='user' />
                            <div className="NU-username">{notif.userTo.username}</div>
                        </Link>
                        <PostSmall post={notif.post} user={notif.userTo.username} />
                        <div className="n-notif-STJ-container">
                            <div className="n-notif-STJ">skill to join: <strong>{skillToJoin}</strong></div>
                        </div>
                        <div className="n-notif-content-primary">
                            <p className="n-notif-message">{notif.message}</p>
                        </div>
                    </div>
                )
            }
        }
    }
    else {
        if (notif.accepted) {
            if(notif.question) {
                return (
                    <div className="n-notif-container" style={{borderBottom: `5px solid ${notifStatusColor}`}}>
                        <h3 className="n-notif-header" style={{backgroundColor: notifStatusColor}}>recieved question</h3>
                        <Link to={`/user/${notif.userTo.username}`} className="n-notif-user neutralize-link">
                            <div className="NU-label">from:</div>
                            <img src={userIcon} className="NU-icon" alt='user' />
                            <div className="NU-username">{notif.userFrom.username}</div>
                        </Link>
                        <PostSmall post={notif.post} user={notif.userTo.username} style={{margin: 0, padding: 0}} />
                        <div className="n-notif-content-secondary">
                            <h3 className="n-notif-title" style={{marginLeft: '15px'}}>question</h3>
                            <p className="n-notif-message">{notif.question}</p>
                        </div>
                        <div className="n-notif-content-primary">
                            <h3 className="n-notif-title" style={{marginLeft: '15px'}}>answered</h3>
                            <p className="n-notif-message">{notif.answer}</p>
                        </div>
                    </div>
                )
            }
            if (notif.post) {
                const GCLinkStats = websiteStats(notif.post.contactLink)
                const cleanedLink = notif.post.contactLink.split('/')[2]
                const skillToJoin = notif.post.skillNames[notif.proposedContribution.indexOf(1)]
                return (
                    <div className="n-notif-container" style={{borderBottom: `5px solid ${notifStatusColor}`}}>
                        <h3 className="n-notif-header" style={{backgroundColor: notifStatusColor}}>recieved join request</h3>
                        <Link to={`/user/${notif.userTo.username}`} className="n-notif-user neutralize-link">
                            <div className="NU-label">from:</div>
                            <img src={userIcon} className="NU-icon" alt='user' />
                            <div className="NU-username">{notif.userFrom.username}</div>
                        </Link>
                        <PostSmall post={notif.post} user={notif.userTo.username} />
                        <div className="n-notif-STJ-container">
                            <div className="n-notif-STJ">skill to join: <strong>{skillToJoin}</strong></div>
                        </div>
                        <div className="n-notif-content-secondary">
                            <p className="n-notif-message">{notif.message}</p>
                        </div>
                        <h3 className="n-notif-title" style={{marginLeft: '15px'}}>sent group/contact link</h3>
                        <div className="n-button-container">
                            <a href={notif.post.contactLink} className="n-join-link n-SH" style={{backgroundColor: GCLinkStats.color}}>
                                <img src={GCLinkStats.icon} className="n-JL-icon" alt={GCLinkStats.title}/>
                                <h3>{cleanedLink}</h3>
                            </a>
                        </div>
                    </div>
                )
            }
            else {
                return (
                    <div className="n-notif-container" style={{borderBottom: `5px solid ${notifStatusColor}`}}>
                        <h3 className="n-notif-header" style={{backgroundColor: notifStatusColor}}>recieved message</h3>
                        <Link to={`/user/${notif.userTo.username}`} className="n-notif-user neutralize-link">
                            <div className="NU-label">from:</div>
                            <img src={userIcon} className="NU-icon" alt='user' />
                            <div className="NU-username">{notif.userFrom.username}</div>
                        </Link>
                        <div className="n-notif-content-primary">
                            <h3 className="n-notif-title" style={{marginLeft: '15px'}}>message</h3>
                            <p className="n-notif-message">{notif.message}</p>
                        </div>
                    </div>
                )
            }
        }
        if (notif.accepted === null) {
            if(notif.question) {
                return (
                    <div className="n-notif-container" style={{borderBottom: `5px solid ${notifStatusColor}`}}>
                        <h3 className="n-notif-header" style={{backgroundColor: notifStatusColor}}>recieved question</h3>
                        <Link to={`/user/${notif.userTo.username}`} className="n-notif-user neutralize-link">
                            <div className="NU-label">from:</div>
                            <img src={userIcon} className="NU-icon" alt='user' />
                            <div className="NU-username">{notif.userFrom.username}</div>
                        </Link>
                        <PostSmall post={notif.post} user={notif.userTo.username} style={{margin: 0, padding: 0}} />
                        <div className="n-notif-content-secondary">
                            <h3 className="n-notif-title" style={{marginLeft: '15px'}}>question</h3>
                            <p className="n-notif-message">{notif.question}</p>
                        </div>
                        <div className="n-notif-reply">
                            <h3 className="n-notif-title">reply</h3>
                            <textarea className="n-notif-reply-field" {...answer.fields} />
                            <div className="n-button-container">
                                <h3 onClick={() => handleAnswer()} className="n-AoD-option n-SH" style={{backgroundColor: 'rgb(52,166,95)'}}>answer</h3>
                            </div>
                        </div>
                    </div>
                )
            }
            else {
                const skillToJoin = notif.post.skillNames[notif.proposedContribution.indexOf(1)]
                return (
                    <div className="n-notif-container" style={{borderBottom: `5px solid ${notifStatusColor}`}}>
                        <h3 className="n-notif-header" style={{backgroundColor: notifStatusColor}}>recieved join request</h3>
                        <Link to={`/user/${notif.userFrom.username}`} className="n-notif-user neutralize-link">
                            <div className="NU-label">from:</div>
                            <img src={userIcon} className="NU-icon" alt='user' />
                            <div className="NU-username">{notif.userFrom.username}</div>
                        </Link>
                        <PostSmall post={notif.post} user={notif.userTo.username} />
                        <div className="n-notif-STJ-container">
                            <div className="n-notif-STJ">skill to join: <strong>{skillToJoin}</strong></div>
                        </div>
                        <div className="n-notif-content-secondary">
                            <h3 className="n-notif-title" style={{marginLeft: '15px'}}>message</h3>
                            <p className="n-notif-message">{notif.message}</p>
                        </div>
                        <h3 className="n-notif-title" style={{marginLeft: '15px'}}>accept</h3>
                        <div className="n-notif-AoD">
                            <h3 onClick={() => handleDecline()} className="n-AoD-option n-SH" style={{backgroundColor: 'rgb(254,52,77)'}}>decline</h3>
                            <h3 onClick={() => handleAccept()} className="n-AoD-option n-SH" style={{backgroundColor: 'rgb(52,166,95)'}}>accept</h3>
                        </div>
                    </div>
                )
            }
        }
        else {
            if(notif.question) {
                return (
                    <div className="n-notif-container" style={{borderBottom: `5px solid ${notifStatusColor}`}}>
                        <h3 className="n-notif-header" style={{backgroundColor: notifStatusColor}}>recieved question</h3>
                        <Link to={`/user/${notif.userFrom.username}`} className="n-notif-user neutralize-link">
                            <div className="NU-label">from:</div>
                            <img src={userIcon} className="NU-icon" alt='user' />
                            <div className="NU-username">{notif.userFrom.username}</div>
                        </Link>
                        <PostSmall post={notif.post} user={notif.userTo.username} style={{margin: 0, padding: 0}} />
                        <div className="n-notif-content-primary">
                            <h3 className="n-notif-title" style={{marginLeft: '15px'}}>question</h3>
                            <p className="n-notif-message">{notif.question}</p>
                        </div>
                    </div>
                )
            }
            else {
                const skillToJoin = notif.post.skillNames[notif.proposedContribution.indexOf(1)]
                return (
                    <div className="n-notif-container" style={{borderBottom: `5px solid ${notifStatusColor}`}}>
                        <h3 className="n-notif-header" style={{backgroundColor: notifStatusColor}}>recieved join request</h3>
                        <Link to={`/user/${notif.userTo.username}`} className="n-notif-user neutralize-link">
                            <div className="NU-label">to:</div>
                            <img src={userIcon} className="NU-icon" alt='user' />
                            <div className="NU-username">{notif.userTo.username}</div>
                        </Link>
                        <PostSmall post={notif.post} user={notif.userTo.username} />
                        <div className="n-notif-STJ-container">
                            <div className="n-notif-STJ">skill to join: <strong>{skillToJoin}</strong></div>
                        </div>
                        <div className="n-notif-content-primary">
                            <h3 className="n-notif-title" style={{marginLeft: '15px'}}>message</h3>
                            <p className="n-notif-message">{notif.message}</p>
                        </div>
                    </div>
                )
            }
        }
    }
}

const mapStateToProps = (state) => {
	return {
        currentUser: state.currentUser
	}
}
export default connect(
    mapStateToProps,
    { setCurrentUserNotifications, setAlert, resetAlert }
)(Notif)
