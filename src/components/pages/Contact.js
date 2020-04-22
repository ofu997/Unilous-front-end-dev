import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import '../../static/css/contact.css'
import logoIcon from '../../static/svg/logoW.svg'

const Contact = (props) => {
    
    return (
        <div>
            <div className="navbar-height" />
            <div className="contacts-container">
                <div className="contact-container">
                    <Link to="/user/Sebastian Sosa" className="contact-header neutralize-link">
                        <img src={logoIcon} className="CH-icon" alt="ProjectU" />
                        <h3 className="CH-name">Sebastian Sosa</h3>
                    </Link>
                    <img src="https://i.imgur.com/zgwIwOS.png" className="profile-image" alt="profile" />
                    <div className="contact-info-container">
                        <div className="contact-info" style={{backgroundColor: '#f6f6f9'}}><strong>postion:</strong> founder, full stack developer</div>
                        <div className="contact-info"><strong>email:</strong> 1sebastian1sosa1@gmail.com</div>
                        <div className="contact-info"><strong>phone:</strong> +1 786-270-7297</div>
                    </div>
                </div>
                <div className="contact-container">
                    <Link to="/user/Mikhail" className="contact-header neutralize-link">
                        <img src={logoIcon} className="CH-icon" alt="ProjectU" />
                        <h3 className="CH-name">Mikhail</h3>
                    </Link>
                    <img src="https://i.imgur.com/ew81eQe.png" className="profile-image" alt="profile" />
                    <div className="contact-info-container">
                        <div className="contact-info" style={{backgroundColor: '#f6f6f9'}}><strong>postion:</strong> UI/UX editor</div>
                        <div className="contact-info"><strong>email:</strong> silverusdragonitos@yandex.ru</div>
                        <div className="contact-info"><strong>phone:</strong> +7 952 156 96 49</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

//const mapStateToProps = (state) => {
//	return {
        
//	}
//}
export default connect(
    null
)(Contact)