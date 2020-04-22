import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { palletteGenerator } from '../../hooks/index'
import { useMutation } from '@apollo/react-hooks'
import { DELETE_POST, REMOVE_SAVED_POST } from '../../schemas'
import userIcon from '../../static/svg/userB.svg'
import { setCurrentUserPosts, setCurrentUserSP } from '../../reducers/currentUser'
import { setPostsForUFP } from '../../reducers/userForPage'

const PostSmall = (props) => {
    const handleError = (e) => {
        console.log(e)
    }
    const [ deletePostMutation ] = useMutation(DELETE_POST, {
        onError: handleError
    })
    const [ removeSPMutation ] = useMutation(REMOVE_SAVED_POST, {
        onError: handleError
    })
    const p = props.post
    const pallette = palletteGenerator(p.color).colorPallette
    const handleRemove = async () => {
        console.log(props.post._id)
        const result = await deletePostMutation({
            variables: {postId: props.post._id}
        })
        if (result) {
            props.setCurrentUserPosts(props.currentUser.posts.filter(p => p._id !== props.post._id))
            props.setPostsForUFP(props.userForPage.posts.filter(p => p._id !== props.post._id))
            
        }
    }
    const handleSaveRemove = async () => {
        const result = await removeSPMutation({
            variables: {
                user: props.currentUser._id,
                postId: p._id
            }
        })
        if (result) {
            const newSavedPosts = props.currentUser.savedPosts.filter(post => post._id !== p._id)
            props.setCurrentUserSP(newSavedPosts)
            console.log('saved post removed')
        }
    }
    
    if (props.type === 'saved') {
        return (
            <div className="post-wrapper-sm">
                <div className="post-color-indicator" style={{backgroundColor: pallette.color}} />
                <div className="post-container">
                    <div className="post-header">
                        <Link to={`/user/${encodeURIComponent(p.user.username)}`} className="PH-user neutralize-link ">
                            <img className="PHU-icon" src={userIcon} alt="user" />
                            <div>{p.user.username}</div>
                        </Link>
                    </div>
                    <Link to={`/post/${encodeURIComponent(p.title)}`} className="neutralize-link"><h3 className="post-title" style={{marginBottom: '7px'}}>{p.title}</h3></Link>
                </div>
                <div onClick={() => handleSaveRemove()} className="post-sm-remove">x</div>
            </div>
        )
    }

    if (props.currentUser) {
        if (p.user === props.currentUser.username) {
            return (
                <div className="post-wrapper-sm">
                    <div className="post-color-indicator" style={{backgroundColor: pallette.color}} />
                    <div className="post-container">
                        <div className="post-header">
                            <Link to={`/user/${encodeURIComponent(p.user)}`} className="PH-user neutralize-link ">
                                <img className="PHU-icon" src={userIcon} alt="user" />
                                <div>{p.user}</div>
                            </Link>
                        </div>
                        <Link to={`/post/${encodeURIComponent(p.title)}`} className="neutralize-link"><h3 className="post-title" style={{marginBottom: '7px'}}>{p.title}</h3></Link>
                    </div>
                    <div onClick={() => handleRemove()} className="post-sm-remove">x</div>
                </div>
            )
        }
    }

    return (
        <div className="post-wrapper-sm" style={{gridTemplateColumns: '8px auto'}}>
            <div className="post-color-indicator" style={{backgroundColor: pallette.color}} />
            <div className="post-container">
                <div className="post-header">
                    <Link to={`/user/${encodeURIComponent(props.user)}`} className="PH-user neutralize-link ">
                        <img className="PHU-icon" src={userIcon} alt="user" />
                        <div>{props.user}</div>
                    </Link>
                </div>
                <Link to={`/post/${encodeURIComponent(p.title)}`} className="neutralize-link"><h3 className="post-title" style={{marginBottom: '7px'}}>{p.title}</h3></Link>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
	return {
        currentUser: state.currentUser,
        userForPage: state.userForPage
	}
}
export default connect(
    mapStateToProps,
    { setCurrentUserPosts, setCurrentUserSP, setPostsForUFP }
)(PostSmall)