import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { useQuery } from '@apollo/react-hooks'
import { SKILL_SEARCH } from '../../schemas/queries'
import Loading from '../Loading'

const SkillSugg = (props) => {
    const splitQuery = props.query.toLowerCase().split(' ')
    const lastWord = splitQuery.slice(-1) === '' ? splitQuery.slice(-2, -1)[0] : splitQuery.slice(-1)[0]
    const [skills, setSkills] = useState([])
    const skillSearchQuery = useQuery(SKILL_SEARCH, {
        variables: {filter: lastWord}
    })
    const skillConditions = (query, reducer) => {
        if (!query) return null
        if (!query.skillSearch) return null
        return query.skillSearch
    }

    const skillsList = skillConditions(skillSearchQuery.data, skills)
    useEffect(() => {
        if (skillsList) {
            setSkills(skillsList)
        }
    }, [skillsList, skills])

    const suggestionsToShow = () => {
        if (skills) {
            return (
                skills.map(s => 
                    <div onClick={() => props.onSuggestionClicked(s.name)} className="search-suggestion" key={`SS${s.name}`}>{s.name}</div>
                )
            )
        }
        return (
            <div style={{gridColumn: '1/3'}}>
                <div style={{height: '5vh'}}/>
                <Loading />
            </div>
        )
    }

    const suggestionsStyle = skills.length !== 0 && props.query !== '' && lastWord !== '' ? {display: 'block'} : {display: 'none'}

    return (
        <div className="search-suggestions-container">
            <div className="search-suggestions" style={suggestionsStyle}>
                {suggestionsToShow()}
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
)(SkillSugg)