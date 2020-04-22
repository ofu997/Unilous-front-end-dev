export const initializePosts = (posts) => {
    return async dispatch => {
        dispatch({
            type: 'INIT_POSTS',
            data: posts
        })
    }
}

export const addPosts = (posts) => {
    return async dispatch => {
        dispatch({
            type: 'ADD_POSTS',
            data: posts
        })
    }
}

const posts = (state = null, action) => {
    switch (action.type) {
        case 'INIT_POSTS':
            return action.data
        case 'ADD_POSTS':
            if (state === null) {
                return action.data
            }
            return state.concat(action.data)
        default:
            return state
    }
}

export default posts