export const setSearch = (search) => {
    return async dispatch => {
        dispatch({
            type: 'SET_SEARCH',
            data: search
        })
    }
}

const search = (state = '', action) => {
    switch (action.type) {
        case 'SET_SEARCH':
          return action.data
        default:
            return state
    }
}

export default search