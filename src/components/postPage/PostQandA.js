import React, { useState } from 'react'
import { connect } from 'react-redux'
import userIcon from '../../static/svg/userB.svg'
import { Link } from 'react-router-dom'

const PostQandA = (props) => {
    const [expanded, setExpanded] = useState(false)
    const answerStyle = expanded ? {display: 'block'} : {display: 'none'}
    return (
        <div className="PPC-qanda-container">
            <Link to={`/user/${encodeURIComponent(props.qanda.userFrom.username)}`} className="PPC-qanda-header neutralize-link">
                <img className="PPC-user-icon" src={userIcon} alt="user" />
                <p className="NM">{props.qanda.userFrom.username}</p>
            </Link>
            <p className="PCC-qanda-content">{props.qanda.question}</p>
            <div className="PCC-qanda-answer-container" style={answerStyle}>
                <Link to={`/user/${encodeURIComponent(props.qanda.userFrom.username)}`} className="PPC-qanda-header neutralize-link">
                    <img className="PPC-user-icon" src={userIcon} alt="user" />
                    <p className="NM">{props.qanda.userTo.username}</p>
                </Link>
                <p className="PCC-qanda-content">{props.qanda.answer}</p>
            </div>
            <div onClick={() => setExpanded(!expanded)} className="PCC-answer-toggle">
                {expanded ? 'hide answer' : 'show answer'}
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
)(PostQandA)