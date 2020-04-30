import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { useMutation } from '@apollo/react-hooks'
import { SAVE_POST } from '../../schemas/mutations'
import { setCurrentUserSP } from '../../reducers/currentUser'
import '../../static/css/post.css'
import userIcon from '../../static/svg/userB.svg'
import { palletteGenerator, triggerAlert } from '../../functions/functions'
import { setAlert, resetAlert } from '../../reducers/alertNotif'
import { CopyToClipboard } from 'react-copy-to-clipboard'

const Post = (props) => {
    const post = props.post
    const color = post.color
    const colorPalette = palletteGenerator(color).colorPallette

    const handleError = (e) => {
        // console.log(e)
    }
    const [savePostMutation] = useMutation(SAVE_POST, {
        onError: handleError
    })
    const handleSavePost = async () => {
        if (!props.token) {
            triggerAlert('warning', 'sign in$: must be signed in to perform this action', props.setAlert, props.resetAlert)
            return null
        }
        const result = await savePostMutation({
            variables: {
                user: props.currentUser._id,
                postId: post._id
            }
        })
        if (result) {
            props.setCurrentUserSP(props.currentUser.savedPosts.concat(post))
            triggerAlert('success', 'followed$: you are now following this post', props.setAlert, props.resetAlert)
        }
    }

    const handleShare = () => {
        triggerAlert('success', 'copied url$: copied url to dashboard', props.setAlert, props.resetAlert)
    }

    const mappedSkills = () => {
        let allSkills = []
        for (const ind in post.skillNames) {
            allSkills.push(
                <Link to={`/browse/${encodeURIComponent(post.skillNames[ind])}`} className="post-skill-ins-container neutralize-link" key={`SI${post.skillNames[ind]}`}>
                    <h4 className="PSI-name">{post.skillNames[ind]}</h4>
                    <div className="PSI-stats">
                        {`${post.skillFills[ind]} / ${post.skillCapacities[ind]}`}
                    </div>
                </Link>
            )
        }
        return allSkills
    }
    let cleanedTime = new Date(Number(post.time))
    cleanedTime = cleanedTime.toString().split(' ')
    // cleanedTime = cleanedTime.slice(1,4).join(' ') + ' ' + cleanedTime[4].split(':').slice(0,2).join(':')
    cleanedTime = cleanedTime.slice(1,3).join(' ') + ', ' + cleanedTime[3]
    if (props.stretch) {
        return (
            <div className="post-wrapper">
                <div className="post-color-indicator" style={{backgroundColor: colorPalette.color}} />
                <div className="post-container">
                    <div className="post-header-wrapper">
                        <div className="post-utilities-container">
                            <div onClick={() => handleSavePost()} className="PU-icon-container">
                                <svg className="PU-icon" fill={colorPalette.color}  viewBox="0 -28 512.00002 512" xmlns="http://www.w3.org/2000/svg"><path d="m471.382812 44.578125c-26.503906-28.746094-62.871093-44.578125-102.410156-44.578125-29.554687 0-56.621094 9.34375-80.449218 27.769531-12.023438 9.300781-22.917969 20.679688-32.523438 33.960938-9.601562-13.277344-20.5-24.660157-32.527344-33.960938-23.824218-18.425781-50.890625-27.769531-80.445312-27.769531-39.539063 0-75.910156 15.832031-102.414063 44.578125-26.1875 28.410156-40.613281 67.222656-40.613281 109.292969 0 43.300781 16.136719 82.9375 50.78125 124.742187 30.992188 37.394531 75.535156 75.355469 127.117188 119.3125 17.613281 15.011719 37.578124 32.027344 58.308593 50.152344 5.476563 4.796875 12.503907 7.4375 19.792969 7.4375 7.285156 0 14.316406-2.640625 19.785156-7.429687 20.730469-18.128907 40.707032-35.152344 58.328125-50.171876 51.574219-43.949218 96.117188-81.90625 127.109375-119.304687 34.644532-41.800781 50.777344-81.4375 50.777344-124.742187 0-42.066407-14.425781-80.878907-40.617188-109.289063zm0 0"/></svg>
                            </div>
                            <CopyToClipboard onCopy={() => handleShare()} text={`http://localhost:3000/post/${encodeURIComponent(post.title)}`} className="PU-icon-container">
                                <svg className="PU-icon" style={{width: '20px', paddingRight: '5px', paddingLeft: '5px'}} fill={colorPalette.color} viewBox="0 -22 512 511" xmlns="http://www.w3.org/2000/svg"><path d="m512 233.820312-212.777344-233.320312v139.203125h-45.238281c-140.273437 0-253.984375 113.710937-253.984375 253.984375v73.769531l20.09375-22.019531c68.316406-74.851562 164.980469-117.5 266.324219-117.5h12.804687v139.203125zm0 0"/></svg>
                            </CopyToClipboard>
                        </div>
                        <div className="post-header-stretch">
                            <Link to={`/user/${encodeURIComponent(post.user.username)}`} className="PH-user-stretch neutralize-link post-hover">
                                <img className="PHU-icon" src={userIcon} alt="user" />
                                <div>{post.user.username}</div>
                            </Link>
                            <div className="PH-date">{cleanedTime}</div>               
                        </div>

                    </div>


                    <Link to={`/post/${encodeURIComponent(post.title)}`} className="neutralize-link"><h3 className="post-title post-hover">{post.title}</h3></Link>
                    <Link to={`/post/${encodeURIComponent(post.title)}`} className="post-description neutralize-link post-hover">
                        {post.description}
                    </Link>
                    <div className="post-skills-container">
                        {mappedSkills()}
                    </div>
                </div>
            </div>
        )
    }
    return (
        <div className="post-wrapper">
            <div className="post-color-indicator" style={{backgroundColor: colorPalette.color}} />
            <div className="post-container">
                <div className="post-header">
                    <Link to={`/user/${encodeURIComponent(post.user.username)}`} className="PH-user neutralize-link post-hover">
                        <img className="PHU-icon" src={userIcon} alt="user" />
                        <div>{post.user.username}</div>
                    </Link>
                    <div className="PH-date">{cleanedTime}</div>               
                </div>
                <Link to={`/post/${encodeURIComponent(post.title)}`} className="neutralize-link"><h3 className="post-title post-hover">{post.title}</h3></Link>
                <Link to={`/post/${encodeURIComponent(post.title)}`} className="post-description neutralize-link post-hover">
                    {post.description}
                </Link>
                <div className="post-skills-container">
                    {mappedSkills()}
                </div>
                <div className="post-utilities-container">
                    <div onClick={() => handleSavePost()} className="PU-icon-container">
                        <svg className="PU-icon" fill={colorPalette.color}  viewBox="0 -28 512.00002 512" xmlns="http://www.w3.org/2000/svg"><path d="m471.382812 44.578125c-26.503906-28.746094-62.871093-44.578125-102.410156-44.578125-29.554687 0-56.621094 9.34375-80.449218 27.769531-12.023438 9.300781-22.917969 20.679688-32.523438 33.960938-9.601562-13.277344-20.5-24.660157-32.527344-33.960938-23.824218-18.425781-50.890625-27.769531-80.445312-27.769531-39.539063 0-75.910156 15.832031-102.414063 44.578125-26.1875 28.410156-40.613281 67.222656-40.613281 109.292969 0 43.300781 16.136719 82.9375 50.78125 124.742187 30.992188 37.394531 75.535156 75.355469 127.117188 119.3125 17.613281 15.011719 37.578124 32.027344 58.308593 50.152344 5.476563 4.796875 12.503907 7.4375 19.792969 7.4375 7.285156 0 14.316406-2.640625 19.785156-7.429687 20.730469-18.128907 40.707032-35.152344 58.328125-50.171876 51.574219-43.949218 96.117188-81.90625 127.109375-119.304687 34.644532-41.800781 50.777344-81.4375 50.777344-124.742187 0-42.066407-14.425781-80.878907-40.617188-109.289063zm0 0"/></svg>
                    </div>
                    <CopyToClipboard onCopy={() => handleShare()} text={`http://localhost:3000/post/${encodeURIComponent(post.title)}`} className="PU-icon-container">
                        <svg className="PU-icon" style={{width: '20px', paddingRight: '5px', paddingLeft: '5px'}} fill={colorPalette.color} viewBox="0 -22 512 511" xmlns="http://www.w3.org/2000/svg"><path d="m512 233.820312-212.777344-233.320312v139.203125h-45.238281c-140.273437 0-253.984375 113.710937-253.984375 253.984375v73.769531l20.09375-22.019531c68.316406-74.851562 164.980469-117.5 266.324219-117.5h12.804687v139.203125zm0 0"/></svg>
                    </CopyToClipboard>
                </div>
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
    { setCurrentUserSP, setAlert, resetAlert }
)(Post)