export const setSkillProposition = (arr) => {
    return async dispatch => {
        dispatch({
            type: 'SET_SKILL_PROPOSITION',
            data: arr
        })
    }
}

const skillProposition = (state = null, action) => {
    switch (action.type) {
        case 'SET_SKILL_PROPOSITION' :
            return action.data
        default :
            return state
    }
}

export default skillProposition