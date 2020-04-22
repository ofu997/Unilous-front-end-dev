export const setUserForPage = (user) => {
    return async dispatch => {
        dispatch({
            type: 'SET_USER_FOR_PAGE',
            data: user
        })
    }
}

export const setPostsForUFP = (postList) => {
    return async dispatch => {
        dispatch({
            type: 'SET_POSTS_FOR_UFP',
            data: postList
        })
    }
}

const userForPage = (state = null, action) => {
    switch (action.type) {
        case 'SET_USER_FOR_PAGE' :
            return action.data
        case 'SET_POSTS_FOR_UFP' :
            return {...state, posts: action.data}
        default :
            return state
    }
}

export default userForPage