import React from 'react'
import { connect } from 'react-redux'
import { websiteStats } from '../hooks/index'

const ReferenceLink = (props) => {
    const referenceLinkContent = websiteStats(props.rl)
    
    return (
        <div className="referenceLink-wrapper">
            <div className="referenceLink-container" style={{backgroundColor: referenceLinkContent.color}}>
                <img src={referenceLinkContent.icon} className="RL-icon" alt={referenceLinkContent.title} />
                <a href={props.rl} className="RL-link neutralize-link" style={{color: referenceLinkContent.color}}><div style={{margin: 'auto', fontWeight: 'bold'}}>{props.rl}</div></a>
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
)(ReferenceLink)