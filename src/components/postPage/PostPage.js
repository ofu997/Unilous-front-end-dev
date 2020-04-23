import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { FIND_POST, Q_AND_A_NOTIFS, MAKE_NOTIFICATION, ASK_QUESTION, SAVE_POST } from '../../schemas'
import { Link } from 'react-router-dom'
import Loading from '../Loading'
import '../../static/css/newPostPage.css'
import userIcon from '../../static/svg/userB.svg'
import PostImages from './PostImages'
import PostLinks from './PostLinks'
import PostQandA from './PostQandA'
import InputHeader from '../InputHeader'
import FormContainer from '../FormContainer'
import plusIcon from '../../static/svg/plusW.svg'
import searchIcon from '../../static/svg/searchWW.svg'
import { setCurrentUserSP } from '../../reducers/currentUser'
import { setAlert, resetAlert } from '../../reducers/alertNotif'
import { useField, triggerAlert, palletteGenerator } from '../../hooks/index'

const PostPage = (props) => {
    const [currentPost, setCurrentPost] = useState(null)
    const [skillExpanded, setSkillExpanded] = useState(null)
    const question = useField('text')
    const message = useField('text')
    const onJoinError = (e) => {
        if (e.message.includes('is longer than the maximum allowed length')) {
            triggerAlert('warning', `message$: message of ${message.fields.value.length} characters exceeded the maximum of 800 characters.`, props.setAlert, props.resetAlert)
        }
    }
    const onQuestionError = (e) => {
        if (e.message.includes('is longer than the maximum allowed length')) {
            triggerAlert('warning', `question$: question of ${question.fields.value.length} characters exceeded the maximum of 800 characters.`, props.setAlert, props.resetAlert)
        }
    }
    const onFollowError = (e) => {
        console.log(e)
    }

    const [followMutation] = useMutation(SAVE_POST, {
        onError: onFollowError
    })
    const [makeNotification] = useMutation(MAKE_NOTIFICATION, {
        onError: onJoinError
    })
    const [askQuestion] = useMutation(ASK_QUESTION, {
        onError: onQuestionError
    })

    const handleFollow = async () => {
        if (!props.token) {
            triggerAlert('warning', 'sign in$: must be signed in to perform this action', props.setAlert, props.resetAlert)
        }
        console.log(props.currentUser._id, currentPost._id)
        const result = await followMutation({
            variables: {
                user: props.currentUser._id,
                postId: currentPost._id
            }
        })

        if (result) {
            props.setCurrentUserSP(props.currentUser.savedPosts.concat(currentPost))
            triggerAlert('success', 'followed$: you are now following this post', props.setAlert, props.resetAlert)
        }
    }
    
    const qandaQuery = useQuery(Q_AND_A_NOTIFS, {
        variables: {title: decodeURIComponent(props.postTitle)}
    })
    const postQuery = useQuery(FIND_POST, {
        variables: {title: decodeURIComponent(props.postTitle)}
    })
    const qandaChangeConditions = () => {
        const query = qandaQuery.data
        const reducer = currentPost
        if (!query) return null
        if (!query.searchAnsweredQToPost) return null
        if (!reducer) return null
        if (reducer.qanda) return null
        return query.searchAnsweredQToPost
    }
    const postChangeConditions = () => {
        const query = postQuery.data
        const reducer = currentPost
        if (!query) return null
        if (!query.findPost) return null
        if (reducer) return null
        return query.findPost
    }
    const qanda = qandaChangeConditions()
    const post = postChangeConditions()
    useEffect(() => {
        if (qanda) {
            setCurrentPost({...currentPost, qanda})
        }
        if (post) {
            setCurrentPost(post)
        }
    }, [qanda, post, setCurrentPost, currentPost])
    if (!currentPost || !currentPost.qanda) {
        return <Loading />
    }

    let cleanedTime = new Date(Number(currentPost.time))
    cleanedTime = cleanedTime.toString().split(' ')
    // cleanedTime = cleanedTime.slice(1,4).join(' ') + ' ' + cleanedTime[4].split(':').slice(0,2).join(':')
    cleanedTime = cleanedTime.slice(1,3).join(' ') + ', ' + cleanedTime[3]

    let qandaList = currentPost.qanda.map(i => <PostQandA qanda={i} key={`QandA${i.question}`} />)
    qandaList = qandaList.length ? qandaList : <div className="qanda-text">no question and answer pairs yet</div>
    const skillsHTML = []
    const questionStyle = skillExpanded ? {display: 'none'} : {display: 'block'}
    const handleNotification = async (proposedContribution) => {
        if (!props.currentUser) {
            triggerAlert('warning', `sign in$: must be signed in to perform this action`, props.setAlert, props.resetAlert)
            return null
        }
        if (!message.fields.value.length) {
            triggerAlert('warning', `message$: message field is required`, props.setAlert, props.resetAlert)
            return null
        }
        const result = await makeNotification({
            variables: {
                userFromId: props.currentUser._id,
                userToId: currentPost.user._id,
                message: message.fields.value,
                postId: currentPost._id,
                proposedContribution
            }
        })
        if (result) {
            setSkillExpanded(null)
            message.reset()
            triggerAlert('success', `sent$: request has been sent to ${currentPost.user.username}`, props.setAlert, props.resetAlert)
        }
    }
    for (const ins in currentPost.skillNames) {
        const skillName = currentPost.skillNames[ins]
        const skillFill = currentPost.skillFills[ins]
        const skillCap = currentPost.skillCapacities[ins]
        const messageStyle = skillExpanded === skillName ? {display: 'block'} : {display: 'none'}
        const buttonToShown = skillExpanded === skillName ?
            <h4 onClick={() => setSkillExpanded(null)} className="PPS-button-exit">X</h4>
            :
            skillFill < skillCap ?
                <h4 onClick={() => setSkillExpanded(skillName)} className="PPS-button">join</h4>
                :
                <h4 className="PPS-button-disabled">join</h4>

        const skillProposition = Array(currentPost.skillNames.length).fill(0)
        skillProposition[ins] = 1
        skillsHTML.push( 
            <div className="PPS-skill" key={`PPSS${skillName}`}>
                <div className="PPS-division" />
                <p className="PPS-skill-name">{skillName}</p>
                <div className="PPS-skill-secondary">
                    <p className="PPS-skill-info">{skillFill}/{skillCap}</p>
                    {buttonToShown}
                </div>
                <div className="PPS-skill-form" style={messageStyle}>
                    <div className="PPS-title">
                        <InputHeader inputFor="PPS-message" info={false} title="message" color="white" />
                    </div>
                    <div className="PPS-input-container">
                        <textarea className="PPS-input" id="PPS-message" {...message.fields}></textarea>
                    </div>
                    <div className="PPC-submit-container">
                        {<h4 onClick={() => handleNotification(skillProposition)} className="PPS-button" style={{borderColor: currentPost.color}}>join</h4>}
                    </div>
                </div>
            </div>
        )
    }

    const handleQuestion = async () => {
        if (!props.currentUser) {
            triggerAlert('warning', `sign in$: must be signed in to perform this action`, props.setAlert, props.resetAlert)
            return null
        }
        if (!question.fields.value.length) {
            triggerAlert('warning', `question$: question field is required`, props.setAlert, props.resetAlert)
            return null
        }
        const result = await askQuestion({
            variables: {
                userFromId: props.currentUser._id,
                userToId: currentPost.user._id,
                postId: currentPost._id,
                question: question.fields.value
            }
        })
        if (result) {
            question.reset()
            triggerAlert('success', `sent$: question has been sent to ${currentPost.user.username}`, props.setAlert, props.resetAlert)
        }
    }
    const pallette = palletteGenerator(currentPost.color).colorPallette

    const teamHTML = currentPost.team.map(un =>
        <Link to={`/user/${un}`} className="PPC-user-container neutralize-link" key={`PT${un}`}>
            <img className="PPC-user-icon" src={userIcon} alt="user" />
            <p className="NM">{un}</p>
        </Link>
    )

    const HomeContent = () => {
        if (props.home) {
            return (
                <div className="home-options">
                    <Link to="/browse/" className="home-option neutralize-link" style={{backgroundColor: 'rgb(52,166,95)'}}>
                        <img src={searchIcon} className="home-option-icon" alt="search" />
                        <h3 className="home-option-text">start browsing</h3>
                    </Link>
                    <Link to="/post-form/" className="home-option neutralize-link" style={{backgroundColor: '#5370b5'}}>
                        <img src={plusIcon} className="home-option-icon" alt="add" />
                        <h3 className="home-option-text">add project</h3>
                    </Link>
                </div>

            )

        }
        else {
            return null
        }
    }

    return (
        <div>
            <div className="navbar-height" />
            <div className="post-page-container">
                <div className="PP-content">
                    <HomeContent />
                    <h2 className="PPC-title">{currentPost.title}</h2>
                    <div className="PPC-sub-header">
                        <Link to={`/user/${currentPost.user.username}`} className="PPC-user-container neutralize-link">
                            <img className="PPC-user-icon" src={userIcon} alt="user" />
                            <p className="NM">{currentPost.user.username}</p>
                        </Link>
                        <p className="PPC-time">{cleanedTime}</p>
                    </div>
                    <p className="PPC-description">{currentPost.description}</p>
                    <PostImages imageLinks={currentPost.imageLinks} color={currentPost.color} />
                    <PostLinks referenceLinks={currentPost.referenceLinks} />
                    <h3 className="PPC-title">Q and A</h3>
                    <div className="PPC-all-qanda-container">
                        {qandaList}
                    </div>
                    <h3 className="PPC-title">team</h3>
                    <div className="team-info">{teamHTML.length} team members</div>
                    <div className="PPC-team-container">
                        {teamHTML}
                    </div>
                </div>
                <FormContainer pallette={pallette}>
                    <div  className="PPS-follow-header" >
                        <div onClick={() => handleFollow()} className="PPS-follow-header" style={{borderTop: '2px solid currentPost.color'}}>
                            <svg className="PPC-user-icon" fill={currentPost.color} viewBox="0 -28 512.00002 512" xmlns="http://www.w3.org/2000/svg"><path d="m471.382812 44.578125c-26.503906-28.746094-62.871093-44.578125-102.410156-44.578125-29.554687 0-56.621094 9.34375-80.449218 27.769531-12.023438 9.300781-22.917969 20.679688-32.523438 33.960938-9.601562-13.277344-20.5-24.660157-32.527344-33.960938-23.824218-18.425781-50.890625-27.769531-80.445312-27.769531-39.539063 0-75.910156 15.832031-102.414063 44.578125-26.1875 28.410156-40.613281 67.222656-40.613281 109.292969 0 43.300781 16.136719 82.9375 50.78125 124.742187 30.992188 37.394531 75.535156 75.355469 127.117188 119.3125 17.613281 15.011719 37.578124 32.027344 58.308593 50.152344 5.476563 4.796875 12.503907 7.4375 19.792969 7.4375 7.285156 0 14.316406-2.640625 19.785156-7.429687 20.730469-18.128907 40.707032-35.152344 58.328125-50.171876 51.574219-43.949218 96.117188-81.90625 127.109375-119.304687 34.644532-41.800781 50.777344-81.4375 50.777344-124.742187 0-42.066407-14.425781-80.878907-40.617188-109.289063zm0 0"/></svg>
                            <p className="NM">follow</p>
                        </div>
                    </div>
                    {skillsHTML}
                    <div style={questionStyle}>
                        <div className="PPS-division" />
                        <div className="PPS-title">
                            <InputHeader inputFor="PPS-question" info={true} title="question" color="white" >
                                <ul style={{margin: 0}}>
                                    <li>if answered it will be shown on post</li>
                                </ul>
                            </InputHeader>
                        </div>
                        <div className="PPS-input-container">
                            <textarea className="PPS-input" id="PPS-question" {...question.fields}></textarea>
                        </div>
                        <div className="PPC-submit-container">
                            <h4 onClick={() => handleQuestion()} className="PPS-button" style={{borderColor: currentPost.color}}>ask</h4>
                        </div>
                    </div>
                </FormContainer>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
	return {
        currentUser: state.currentUser,
        token: state.token
	}
}
export default connect(
    mapStateToProps, 
    { setAlert, resetAlert, setCurrentUserSP }
)(PostPage)