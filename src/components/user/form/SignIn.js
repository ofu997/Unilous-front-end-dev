import React from 'react'
import { connect } from 'react-redux'
import { useMutation } from '@apollo/react-hooks'
import { LOGIN } from '../../../schemas'
import { useField, triggerAlert } from '../../../hooks/index'
import { setToken } from '../../../reducers/token'
import InputHeader from '../../InputHeader'
import { setAlert, resetAlert } from '../../../reducers/alertNotif'

const SignIn = (props) => {
    const username = useField('text')
    const password = useField('password')

    const onError = (e) => {
        let cleanedMessage = e.message
        cleanedMessage = cleanedMessage.split(':')
        cleanedMessage = cleanedMessage.slice(1, cleanedMessage.length).join('$:')
        triggerAlert('warning', cleanedMessage, props.setAlert, props.resetAlert)
    }
    const [signInMutation] = useMutation(LOGIN, { onError })
    
    const handleSumbit = async (e) => {
        e.preventDefault()
        const result = await signInMutation({
            variables: {
                username: username.fields.value,
                password: password.fields.value
            }
        })

        if (result) {
            if (props.changeMenuItem) {
                props.changeMenuItem(null)
            }
            const token = result.data.login.value
            username.reset()
            password.reset()
            localStorage.setItem('token', token)
            localStorage.setItem('username', username.fields.value)
            props.setToken(token)
            window.location.reload()
        }
    }

    const bgStyle = props.noBG ? {backgroundColor: '#282828'} : null

    return (
        <div className="user-form-container" style={bgStyle}>
            <form className="user-form" onSubmit={(e) => handleSumbit(e)}>
                <InputHeader inputFor="SI-username" info={false} title="username" color="dark" />
                <input className="UF-input" {...username.fields} id="SI-username" />
                <InputHeader inputFor="SI-password" info={false} title="password" color="dark" />
                <input className="UF-input" {...password.fields} id="SI-password" />
                <button className="UF-submit" type="submit"><h3>sign in</h3></button>
            </form>
        </div>
    )
}

// const mapStateToProps = (state) => {
// 	return {
        
// 	}
// }
export default connect(
    null,
    { setToken, setAlert, resetAlert }
)(SignIn)