export const setAlert = (info) => {
    return async dispatch => {
        dispatch({
            type: 'SET_ALERT',
            data: info
        })
    }
}

export const resetAlert = () => {
    return async dispatch => {
        dispatch({
            type: 'RESET_ALERT'
        })
    }
}

const alertNotif = (state = {color: null, textColor: null, message: null}, action) => {
    switch (action.type) {
        case 'SET_ALERT' :
            return action.data
        case 'RESET_ALERT' :
            return {color: null, textColor: null, message: null}
        default :
            return state
    }
}

export default alertNotif