import {combineReducers, createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import token from './reducers/token'
import logInContainer from './reducers/logInContainer'
import currentUser from './reducers/currentUser'
import posts from './reducers/posts'
import users from './reducers/users'
import search from './reducers/search'
import searchFilter from './reducers/searchFilter'
import currentPost from './reducers/currentPost'
import skillProposition from './reducers/skillProposition'
import userForPage from './reducers/userForPage'
import alertNotif from './reducers/alertNotif'
import stretchLayout from './reducers/stretchLayout'
import eventSearch from './reducers/eventSearch'

const reducer = combineReducers({
    token,
    logInContainer,
    currentUser,
    posts,
    users,
    search,
    searchFilter,
    currentPost,
    skillProposition,
    userForPage,
    alertNotif,
    stretchLayout,
    eventSearch,
})

const store = createStore(
    reducer,
    applyMiddleware(thunk)
)

export default store