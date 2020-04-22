export const toggleStretchLayout = () => {
    return async dispatch => {
        dispatch({
            type: 'TOGGLE_SL',
        })
    }
}

const stretchLayout = (state = true, action) => {
    switch (action.type) {
        case 'TOGGLE_SL' :
            return !state
        default :
            return state
    }
}

export default stretchLayout