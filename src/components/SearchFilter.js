import React, { useState } from 'react'
import { connect } from 'react-redux'

const SearchFilter = (props) => {
    const [active, setActive] = useState(true)

    const toggleActive = () => setActive(!active)

    const dfActiveIcon = active ? '-' : '+'
    const dfActiveStyle = active ?
        { backgroundColor: 'rgb(254,52,77)', lineHeight: '20px' } : { backgroundColor: 'rgb(52,166,95)', lineHeight: '24px' }
    const dfContentStyle = active ? 
        { opacity: '1'} : {opacity: '0.5' }
    const dfQueryStyle = active ? 
        { color: props.color, opacity: '1' } : { color: props.color, opacity: '0.5' }

    return (
        <div className="home-filter-container">
            <h3 style={dfContentStyle} className="df-content df-starter">{props.starter}</h3>
            <h3 style={dfQueryStyle} className="df-content " >{props.query ? props.query : '_'}</h3>
            <h3 style={dfContentStyle} className="df-content df-finisher">{props.finisher}</h3>
            <h1 style={dfActiveStyle} className="df-content df-active" onClick={() => toggleActive()}>{dfActiveIcon}</h1>
        </div>
    )
}

//const mapStateToProps = (state) => {
//	return {
        
//	}
//}
export default connect(
    null
)(SearchFilter)