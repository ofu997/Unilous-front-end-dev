import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { useQuery } from '@apollo/react-hooks'
import { LIST_OF_POSTS } from '../../schemas'
import PostSmall from '../post/PostSmall'
import Loading from '../Loading'

const PostSmallList = (props) => {
    const [posts, setPosts] = useState(null)
    const postListQuery = useQuery(LIST_OF_POSTS, {
        variables: {id_list: props.posts.map(p => p._id)}
    })
    const queryConditions = () => {
        const query = postListQuery.data
        const reducer = posts
        if (!query) return null
        if (!query.getListOfPosts) return null
        if (!query.getListOfPosts.length) return query.getListOfPosts
        if (!reducer || !reducer.length || reducer[0]._id !== query.getListOfPosts[0]._id) return query.getListOfPosts
        return null
    }
      
    const postList = queryConditions()
    useEffect(() => {
        if (postList) {
            setPosts(postList)
        }
    }, [postList, props.setPostsForUFP, props])
    if (!posts) return <Loading />
    if (posts && posts.length > 0) {
        if (!posts[0].title) {
            return <Loading />
        }
    }

    const postListReady = posts.map(p => <PostSmall post={p} user={p.user.username} key={`PSL${p.title}`} />)

    return (
        <React.Fragment>
            {postListReady}
        </React.Fragment>
    )
}

// const mapStateToProps = (state) => {
// 	return {
//         
// 	}
// }
export default connect(
    null
)(PostSmallList)