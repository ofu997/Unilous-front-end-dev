import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import '../../static/css/home.css'
import { setSearch } from '../../reducers/search'

let Home = (props) => {

    return (
        <div className="home-container">
            <div className="navbar-height" />
            <h1 className="home-header">Im looking for:</h1>
        </div>
    )
}

Home = withRouter(Home)

//const mapStateToProps = (state) => {
//	return {
        
//	}
//}
export default connect(
    null,
    { setSearch }
)(Home)