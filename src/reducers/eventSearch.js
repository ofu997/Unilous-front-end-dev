export const setEventSearch = (event) => {
    return async dispatch => {
        dispatch({
            type: 'SET_EVENT',
            data: event
        })
    }
}

const eventSearch = (state = null, action) => {
    switch (action.type) {
        case 'SET_EVENT' :
            return action.data
        default :
            return state
    }
}

export default eventSearch