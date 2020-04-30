import {combineReducers, createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import token from './reducers/token'
import currentUser from './reducers/currentUser'
import posts from './reducers/posts'
import alertNotif from './reducers/alertNotif'
import stretchLayout from './reducers/stretchLayout'
import eventSearch from './reducers/eventSearch'

const reducer = combineReducers({
    token,
    currentUser,
    posts,
    alertNotif,
    stretchLayout,
    eventSearch,
})

const store = createStore(
    reducer,
    applyMiddleware(thunk)
)

export default store