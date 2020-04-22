import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { useQuery } from '@apollo/react-hooks'
import { LIST_OF_POSTS } from '../../../schemas'
import { setCurrentUserSP } from '../../../reducers/currentUser'
import PostSmall from '../../post/PostSmall'
import Loading from '../../Loading'


const UserSP = (props) => {
    const id_list = props.currentUser.savedPosts.map(p => p._id)
    const postListQuery = useQuery(LIST_OF_POSTS, {
        variables: {id_list}
    })
    const queryConditions = (query, reducer) => {
        if (!query) return null
        if (!query.getListOfPosts) return null
        if (!reducer) return query.getListOfPosts
        if (reducer && reducer.length > 0 && !reducer[0].title) return query.getListOfPosts
        return null
    }

    const postList = queryConditions(postListQuery.data, props.currentUser.savedPosts)
    useEffect(()=> {
        if (postList) {
            let newPostList = []
            for (const ind in postList) {
                newPostList.push({...postList[ind], _id: id_list[ind]})
            }
            props.setCurrentUserSP(newPostList)
        }
    }, [postList, props.setCurrentUserSP, props, id_list])

    if (props.currentUser.savedPosts.length > 0 && !props.currentUser.savedPosts[0].user) {
        return (
            <div style={{gridColumn: '1/3'}}>
                <div style={{height: '5vh'}}/>
                <Loading color="white" />
            </div>
        )
    }

    const allSP = props.currentUser.savedPosts.map(p => <PostSmall post={p} user={p.user.username} type="saved" key={`SP${p.title}`} />)
    return (
        <div>
            <div style={{height: '10px'}} />
            {allSP}
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
    { setCurrentUserSP }
)(UserSP)