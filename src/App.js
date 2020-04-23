import React, { useState, useEffect } from 'react'
import { setCurrentUser, setPendingNotifications } from './reducers/currentUser'
import { setToken } from './reducers/token'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'
import NavBar from './components/NavBar'
import SubNav from './components/SubNav'
import Contact from './components/pages/Contact'
import Results from './components/pages/Results'
import PostPage from './components/postPage/PostPage'
import UserPage from './components/pages/UserPage'
import PostFormPage from './components/pages/PostFormPage'
import './static/css/base.css'
import './static/css/navBar.css'
import './static/css/newFormContainer.css'
import { FIND_USER, PENDING_NOTIFS } from './schemas'

const App = (props) => {
  const [query, setQuery] = useState('')

  const onQueryChange = (event) => {
    setQuery(event.target.value)
  }
  if (localStorage.getItem('token') && props.token === null) {
    props.setToken(localStorage.getItem('token'))
  }
  const currentUserId = props.currentUser ? props.currentUser._id : null
  const pendingNotifsQuery = useQuery(PENDING_NOTIFS, {
    variables:  {userId: currentUserId}
  })
  const userQuery = useQuery(FIND_USER, {
    variables: {username: localStorage.getItem('username')}
  })
  const pendingNotifsConditions = () => {
    if (!pendingNotifsQuery.data) return null
    if (props.currentUser && props.currentUser.pendingNotifications) return null
    return pendingNotifsQuery.data.searchAwaitingNotifs
  }
  const userConditions = (query, reducer) => {
    if (!query.data) return null
    if (!query.data.findUser) return null
    if (reducer) return null
    return query.data.findUser
  }
  const pendingNotifs = pendingNotifsConditions()
  const user = userConditions(userQuery, props.currentUser)
  useEffect(() => {
    if (user) {
      props.setCurrentUser(user)
    }
    if (pendingNotifs) {
      props.setPendingNotifications(pendingNotifs)
    }
  }, [user, props.currentUser, props, pendingNotifs, props.setPendingNotifications])

  return (
    <div className="wrapper">
      <Router>
        <NavBar query={query} onQueryChange={onQueryChange} />
        <SubNav />
        <Route exact path="/" render={() => <PostPage home={true} postTitle="This will be the home page post for ProjectU" /> } />
        <Route exact path="/contact/" render={() => <Contact />} />
        <Route exact path="/browse/" render={() => <Results query="" /> } />
        <Route path="/browse/:query" render={({match}) => <Results query={match.params.query} /> } />
        <Route exact path="/post-form/" render={() => <PostFormPage /> } />
        <Route path="/post/:title" render={({match}) => <PostPage postTitle={match.params.title} /> } />
        <Route path="/user/:username" render={({match}) => <UserPage userUsername={match.params.username} /> } />
      </Router>
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    currentUser: state.currentUser,
    token: state.token,
    posts: state.posts,
    users: state.users,
  }
}

export default connect(
  mapStateToProps,
  { setCurrentUser, setToken, setPendingNotifications }
)(App)