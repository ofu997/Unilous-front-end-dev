export const setCurrentUser = (user) => {
    return async dispatch => {
        dispatch({
            type: 'SET_CURRENT_USER',
            data: user
        })
    }
}

export const setCurrentUserPosts = (posts) => {
    return async dispatch => {
        dispatch({
            type: 'SET_CU_POSTS',
            data: posts
        })
    }
}

export const setCurrentUserSP = (posts) => {
    return async dispatch => {
        dispatch({
            type: 'SET_CU_SP',
            data: posts
        })
    }
}

export const setCurrentUserNotifications = (notifications) => {
    return async dispatch => {
        dispatch({
            type: 'SET_CU_NOTIFICATIONS',
            data: notifications
        })
    }
}

export const setPendingNotifications = (amt) => {
    return async dispatch => {
        dispatch({
            type: 'SET_CU_PN',
            data: amt
        })
    }
}

const currentUser = (state = null, action) => {
    switch (action.type) {
        case 'SET_CU_PN':
            return {...state, pendingNotifications: action.data}
        case 'SET_CURRENT_USER' :
            return action.data
        case 'SET_CU_POSTS' :
            return {...state, posts: action.data}
        case 'SET_CU_SP' :
            if (state) {
                return {...state, savedPosts: action.data}
            }
            return state
        case 'SET_CU_NOTIFICATIONS' :
            return {...state, notifications: action.data}
        default :
            return state
    }
}

export default currentUser