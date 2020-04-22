import React from 'react'
import { connect } from 'react-redux'
import { websiteStats } from '../../hooks/index'

const PostLinks = (props) => {
    const links = props.referenceLinks
    if (links.length === 0) {
        return null
    }
const linksToShow = links.map(l => {
    const stats = websiteStats(l)
    let cleanedLink = l.split('/').slice(2,4).join('/')
    if (cleanedLink.length > 40) {
        cleanedLink = `${cleanedLink.slice(0,40)} ...`
    }
    return (
        <a href={l} className="PPC-reference-link neutralize-link" style={{backgroundColor: stats.color}} key={`referenceLink${l}`}>
            <img className="PPC-RL-icon" src={stats.icon} alt={stats.title} />
            <h4 className="NM">{cleanedLink}</h4>
        </a>
    )
})
    return (
        <div className="PPC-links-contaier" >
            {linksToShow}
        </div>
    )
}

// const mapStateToProps = (state) => {
// 	return {
        
// 	}
// }
export default connect(
    null
)(PostLinks)