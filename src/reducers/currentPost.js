export const setCurrentPost = (post) => {
    return async dispatch => {
        dispatch({
            type: 'SET_CURRENT_POST',
            data: post
        })
    }
}

export const editProposedHelp = (arr) => {
    return async dispatch => {
        dispatch({
            type: 'EDIT_PROPOSED_HELP',
            data: arr
        })
    }
}

const currentPost = (state = null, action) => {
    switch (action.type) {
        case 'SET_CURRENT_POST' :
            const editedCurrentPost = {...action.data, proposedHelp: Array(action.data.skillCapacities.length).fill(0)}
            return editedCurrentPost
        case 'EDIT_PROPOSED_HELP' :
            const currentProposedHelp = {...state, proposedHelp: action.data}
            return currentProposedHelp
        default :
            return state
    }
}

export default currentPost