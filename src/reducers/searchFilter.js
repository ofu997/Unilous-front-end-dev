export const setCurrentUser = (user) => {
    return async dispatch => {
        dispatch({
            type: 'SET_CURRENT_USER',
            data: user
        })
    }
}

const searchFilter = (state = null, action) => {
    switch (action.type) {
        case 'SET_CURRENT_USER' :
            return action.data
        default :
            return state
    }
}

export default searchFilter