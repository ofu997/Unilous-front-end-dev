import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import '../../static/css/results.css'
import Post from '../post/Post'
import { useQuery } from '@apollo/react-hooks'
import { SEARCH_POSTS } from '../../schemas'
import { addPosts } from '../../reducers/posts'
import { Link } from 'react-router-dom'
import Loading from '../Loading'
import OldFormContainer from '../OldFormContainer'
import { palletteGenerator } from '../../hooks'
import { toggleStretchLayout } from '../../reducers/stretchLayout'
import { setEventSearch } from '../../reducers/eventSearch'
import covidIconB from '../../static/svg/virusB.svg'
import covidIconW from '../../static/svg/virusW.svg'
import covidIconC from '../../static/svg/virusC.svg'
import usaIconB from '../../static/svg/usaB.svg'
import usaIconW from '../../static/svg/usaW.svg'
import usaIconC from '../../static/svg/usaC.svg'

const Results = (props) => {
    const currentIds = props.posts ? props.posts.map(p => p._id) : []
    const [scrollAtBottom, setScrollAtBottom] = useState(false)
    const decodedSearch = decodeURIComponent(props.query)
    const {data} = useQuery(SEARCH_POSTS,
        {variables: {
            filterString: decodedSearch,
            postIds: currentIds,
            eventQuery: props.eventSearch,
        }}
    )
    if ((window.innerHeight + window.scrollY) > (document.body.offsetHeight - 400) && !scrollAtBottom) {
        setScrollAtBottom(true)
    }
    if ((window.innerHeight + window.scrollY) <= (document.body.offsetHeight - 400) && scrollAtBottom) {
        setScrollAtBottom(false)
    }
    const triggerWhenScroll = () => {
        if ((window.innerHeight + window.scrollY) > (document.body.offsetHeight - 100) && !scrollAtBottom) {
            setScrollAtBottom(true)
        }
        if ((window.innerHeight + window.scrollY) <= (document.body.offsetHeight - 100) && scrollAtBottom) {
            setScrollAtBottom(false)
        }
    }
    window.addEventListener('scroll', triggerWhenScroll, false)

    const postChangeConditions = (query, reducer) => {
        if (!scrollAtBottom) return false
        if (!query) return false
        if (!query.searchPosts) return false
        if (!reducer) return true
        if (query.searchPosts.length !== reducer.length) return true
        const queryTitles = query.searchPosts.map(i => i.title)
        const reducerTitles = reducer.map(i => i.title)
        for (const title of queryTitles) {
            if (!reducerTitles.includes(title)) {
                return true
            }
        }
        return false
    }
    const postsSearched = postChangeConditions(data, props.posts) ?
        data.searchPosts : null

    useEffect(() => {
        if (postsSearched && !props.posts) {
            props.addPosts(data.searchPosts)
        }
        if (postsSearched && props.posts) {
            if (postsSearched.length > 0) {
                if (!props.posts.map(p => p._id).includes(postsSearched[0]._id)){
                    props.addPosts(data.searchPosts)
                }
            }
        }
    }, [data, props.addPosts, props, postsSearched])
    if (!props.posts) {
        return (
            <div>
                <div style={{height: '5vh'}}/>
                <Loading />
            </div>
        )
    }

    const eventQuery = props.eventSearch
    const eventKeys = () => {
        if (eventQuery === 'COVID-19') {
            return ['covid', 'coronavirus', 'outbreak', 'virus', 'emergency response']
        }
        if (eventQuery === '2020 Election') {
            return ['election', 'democrat', 'republican', 'vote']
        }
        return null
    }
    const postToShow = (post, eventKeys) => {
        if (eventKeys) {
            for (const keyWord of eventKeys) {
                if (post.description.toLowerCase().includes(keyWord) || post.title.toLowerCase().includes(keyWord)) {
                    if (post.title.toLowerCase().includes(decodedSearch.toLowerCase())) return true
                }
            }
            return false
        }
        if (post.title.toLowerCase().includes(decodedSearch.toLowerCase())) return true
        for (const skill of post.skillNames) {
            if (decodedSearch.includes(skill)) return true
        }

        return false
    }
    let postsToShow = props.posts
    postsToShow = postsToShow.map(p => postToShow(p, eventKeys()) ? <Post stretch={props.stretchLayout} key={`post${p._id}`} post={p} /> : null)
    const pallette = palletteGenerator('rgb(40,40,40)').colorPallette
    const layoutBtnClass = props.stretchLayout ? 'layout-button-grid' : 'layout-button-stretch'
    const layoutClass = !props.stretchLayout ? 'results-content-grid' : 'results-content-stretch'
    
    const eventsList = [
        {name: 'COVID-19', color: 'rgb(237,32,40)', iconB: covidIconB, iconW: covidIconW, iconC: covidIconC},
        {name: '2020 Election', color: 'rgb(255,0,255)', iconB: usaIconB, iconW: usaIconW, iconC: usaIconC}
    ]
    const eventsHTML = eventsList.map(e => e.name === props.eventSearch ? 
        <div className="event-selected" onClick={() => props.setEventSearch(null)} style={{borderColor: e.color, backgroundColor: e.color}} key={`EV${e.name}`}>
            <img src={e.iconW} className="event-image" alt={e.name} />
            <h3 className="event-text">{e.name}</h3>
        </div>
        :
        <div className="event" onClick={() => props.setEventSearch(e.name)} style={{borderColor: e.color, color: e.color}} key={`EV${e.name}`}>
            <img src={e.iconC} className="event-image" alt={e.name} />
            <h3 className="event-text">{e.name}</h3>
        </div>
    )
    // const resultsTitle = eventsList.map(e => e.name === props.eventSearch ?
    //     <img src={e.iconB} className="title-image" alt={e.name} /> : null
    // )
    const eventsContainerClass = props.eventSearch ? 'EC-active' : null
    return (
        <div className="home-wrapper">
            <div className="results-container">
                <Link to="/post-form/">
                    <OldFormContainer setTitle="create post" icon={pallette.plusIcon} pallette={pallette}>
                        <div />
                    </OldFormContainer>
                </Link>
                <div className="navbar-height"/>
                <h2 className="secondary-title">events</h2>
                <div className={`events-container ${eventsContainerClass}`}>
                    {eventsHTML}
                </div>
                <div onClick={() => props.toggleStretchLayout(!props.stretchLayout)} className="layout-wrapper">
                    <div className="layout-container">
                        <div className={`layout-button ${layoutBtnClass}`} >
                            <div className="layout-box"/>
                            <div className="layout-box"/>
                            <div className="layout-box"/>
                            <div className="layout-box"/>
                        </div>
                    </div>
                </div>
                <div />
                <div className={`results-content ${layoutClass}`}>
                    {postsToShow}
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
	return {
        posts: state.posts,
        search: state.search,
        stretchLayout: state.stretchLayout,
        eventSearch: state.eventSearch,
	}
}
export default connect(
    mapStateToProps,
    { addPosts, toggleStretchLayout, setEventSearch }
)(Results)