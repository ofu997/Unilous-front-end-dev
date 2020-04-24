import React from 'react'
import { connect } from 'react-redux'
import { useMutation } from '@apollo/react-hooks'
import { CREATE_USER } from '../../../schemas'
import InputHeader from '../../InputHeader'
import { useField, triggerAlert } from '../../../hooks/index'
import { setAlert, resetAlert } from '../../../reducers/alertNotif'

const Register = (props) => {
    const username = useField('text')
    const password = useField('password')
    const rePassword = useField('password')
    const email = useField('email')
    const referenceLink = useField('url')

    const onError = (e) => {
        let cleanedMessage = e.message
        console.log(referenceLink.fields.value)
        console.log(e.message)
        if (cleanedMessage.includes('username')) cleanedMessage = `username$: ${username.fields.value} is already being used`
        if (cleanedMessage.includes('referenceLink')) cleanedMessage = `reference link$: ${referenceLink.fields.value} is already being used`
        if (cleanedMessage.includes('email')) cleanedMessage = `email$: ${email.fields.value} is already being used`
        triggerAlert('warning', cleanedMessage, props.setAlert, props.resetAlert)
    }

    const [registerMutation] = useMutation(CREATE_USER, { onError })
    
    const handleSumbit = async (e) => {
        e.preventDefault()
        if (password.fields.value !== rePassword.fields.value) {
            triggerAlert('warning', 'password$: password and re-password did not match', props.setAlert, props.resetAlert)
            return null
        }
        if (!username.fields.value.length || !password.fields.value.length || !rePassword.fields.value.length || !referenceLink.fields.value.length) {
            triggerAlert('warning', 'all$: all fields must be filled', props.setAlert, props.resetAlert)
            return null
        }
        const result = await registerMutation({
            variables: {
                username: username.fields.value,
                password: password.fields.value,
                referenceLink: referenceLink.fields.value,
            }
        })
        
        if (result) {
            if (props.changeMenuItem) {
                props.changeMenuItem(null)
            }
            username.reset()
            password.reset()
            rePassword.reset()
            email.reset()
            referenceLink.reset()
            triggerAlert('success', 'registered$: account successfully created', props.setAlert, props.resetAlert)
            console.log('registered')
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
                <InputHeader inputFor="SI-rePassword" info={false} title="re-type password" color="dark" />
                <input className="UF-input" {...rePassword.fields} id="SI-rePassword" />
                {/* <InputHeader inputFor="SI-email" info={true} title="email" color="dark" >
                    <ul style={{margin: 0}}>
                        <li>untill further policy changes no emails are sent your way</li>
                        <li>only shown to users who you accept after contacting you directly (not through post)</li>
                    </ul>
                </InputHeader>
                <input className="UF-input" {...email.fields} id="SI-email" /> */}
                <InputHeader inputFor="SI-referenceLink" info={true} title="portafolio link" color="dark" >
                    <p style={{margin: 0, marginBottom: '5px'}}>link on your user page used as a resume to demonstrate your ability</p>
                    <p style={{margin: 0, marginBottom: '5px'}}><strong>always view another users portafolio link before working with them</strong></p>
                    <ul style={{margin: 0}}>
                        <li>sites recommended: <strong>LinkedIn</strong>, <strong>Indeed</strong>, <strong>GitHub</strong>, or <strong>Facebook</strong></li>
                        <li>to further ensure your portafolio link is trustworthy, link your Unilous accout from your portafolio link</li>
                    </ul>
                </InputHeader>
                <input className="UF-input" {...referenceLink.fields} id="SI-referenceLink" />
                <button className="UF-submit" type="submit"><h3>register</h3></button>
            </form>
        </div>
    )
}

//const mapStateToProps = (state) => {
//	return {
        
//	}
//}
export default connect(
    null,
    { setAlert, resetAlert }
)(Register)