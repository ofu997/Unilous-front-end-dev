import { useMutation, useQuery } from '@apollo/react-hooks'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { palletteGenerator, triggerAlert, useField } from '../../functions/functions'
import { resetAlert, setAlert } from '../../reducers/alertNotif'
import { MAKE_NOTIFICATION } from '../../schemas/mutations'
import { FIND_USER } from '../../schemas/queries'
import '../../static/css/pages/userPage.css'
import userIcon from '../../static/svg/userB.svg'
import Loading from '../Loading'
import PostSmallList from '../post/PostSmallList'
import FormContainer from '../text-field/FormContainer'
import ReferenceLink from '../text-field/ReferenceLink'

const UserPage = (props) => {
    const [currentUser, setCurrentUser] = useState(null)
    const message = useField('text')
    const decodedUser = decodeURIComponent(props.userUsername)
    const userQuery = useQuery(FIND_USER, {
      variables: {username: decodedUser}
    })

    const currentUserUN = localStorage.getItem('username') ? localStorage.getItem('username') : 'fakeUser';

    const onError = (e) => {
      const eMessage = e.message
      if (eMessage.includes('Path `message` (')) {
        triggerAlert('warning', `message$: message of ${message.fields.value.length} characters cannot be more than 800 characters`, props.setAlert, props.resetAlert)
      }
    }
    const [sendMessage] = useMutation(MAKE_NOTIFICATION, {
      onError
    })
    const handleMessage = async () => {
      if (!message.fields.value.length) {
        triggerAlert('warning', `message$: message field is required`, props.setAlert, props.resetAlert)
        return null
      }
      const result = await sendMessage({
          variables: {
              userFromId: props.currentUser._id,
              userToId: currentUser._id,
              message: message.fields.value,
          }
      })
      if (result) {
          message.reset()
          triggerAlert('success', `sent: message has been sent to ${currentUser.username}`, props.setAlert, props.resetAlert)
      }
  }

    const userConditions = () => {
      const query = userQuery.data
      const reducer = currentUser
      if (!query) return null
      if (!query.findUser) return null
      if (!reducer || reducer.username !== query.username) return query.findUser
      return null
    }

    const user = userConditions()
    useEffect(() => {
      if (user) {
        setCurrentUser(user)
      }
    }, [user, setCurrentUser])
    if (!currentUser) {
      return (
        <div>
            <div style={{height: '15vh'}}/>
            <Loading />
        </div>
      )
    }
    const pallette = palletteGenerator("rgb(40,40,40)").colorPallette
    
    return (
        <div className="userPage-container">
          <div className="navbar-height" style={{gridColumn: '1/3'}} />
          <div className="UP-content">
            <div className="UP-title-container">
              <img className="UP-title-icon" src={userIcon} alt="user" />
              <h2 className="UP-title">{currentUser.username}</h2>
            </div>
            <h3 className="UP-title" style={{opacity: '0.8'}}>profile link</h3>
            <ReferenceLink rl={currentUser.referenceLink} />
            <h2 className="UP-title">posts</h2>
            <div className="UP-posts-container">
              <PostSmallList posts={currentUser.posts} />
            </div>
          </div>
          {(currentUserUN !== currentUser.username) &&
            <FormContainer pallette={pallette} >
                  <h3 className="form-title">contact {currentUser.username}</h3>
                  <h4 className="form-title-secondary">message</h4>
                  <div className="form-field-container">
                    <textarea className="form-field" {...message.fields} />
                  </div >
                  <div className="form-submit-button-container">
                    
                  <h4 onClick={() => handleMessage()} className="form-submit-button">send</h4>
                  </div>
            </FormContainer>}
        </div>
    )
}

const mapStateToProps = (state) => {
	return {
    currentUser: state.currentUser        
	}
}
export default connect(
  mapStateToProps,
  {setAlert, resetAlert}
)(UserPage)