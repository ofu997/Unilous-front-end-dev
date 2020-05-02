import express from 'express'
import path from 'path'

import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import { StaticRouter } from 'react-router-dom'
import { Provider as ReduxProvider } from 'react-redux'
import store from './store'

import { Helmet } from 'react-helmet'

import { ApolloProvider } from '@apollo/react-common'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { getDataFromTree } from '@apollo/react-ssr'

import { setContext } from 'apollo-link-context'

const app = express()

app.use(express.static( path.resolve(__dirname, '../dist') ))
app.get('/*', (req, res) => {
    const authLink = setContext((_, { headers }) => {
        const token = localStorage.getItem('token')
        return {
            headers: {
                ...headers,
                authorization: token ? `berySecret ${token}` : null,
            }
        }
    })

    const httpLink = createHttpLink({
        uri: 'https://projectu-back-end-2020.herokuapp.com/graphql',
    })

    const client = new ApolloClient({
        ssrMode: true,
        link: authLink.concat(httpLink),
        cache: new InMemoryCache()
    })

    const context = {}

    const TheApp = (
        <ApolloProvider client={client}>
            <ReduxProvider store={store}>
                <StaticRouter location={req.url} context={context}>
                    <App />
                </StaticRouter>
            </ReduxProvider>
        </ApolloProvider>
    )

    getDataFromTree(TheApp).then(() => {
        const content = ReactDOM.renderToString(TheApp)
        const initialState = client.extract()
        const reduxState = store.getState()
        const helmetData = Helmet.renderStatic()

        function Html({ content, state, reduxState, helmet }) {
            return (
                <html>
                    <head>
                        <meta charset="utf-8" />
                        {helmet.title.toString()}
                        {helmet.meta.toString()}
                        <title>React SSR</title>
                    </head>
                    <body>
                        <div id="root" dangerouslySetInnerHTML={{ __html: content }} />
                        <script dangerouslySetInnerHTML={{
                            __html: `window.__APOLLO_STATE__=${JSON.stringify(state).replace(/</g, '\\u003c')};`,
                        }} />
                        <script dangerouslySetInnerHTML={{
                            __html: `window.REDUX_DATA = ${JSON.stringify(reduxState)}`
                        }} />
                    </body>
                </html>
            )
        }

        const html = <Html content={content} state={initialState} reduxState={reduxState} helmet={helmetData} />

        res.status(200)
        res.send(`<!DOCTYPE html>\n${ReactDOM.renderToStaticMarkup(html)}`)
        res.end()
    })
})

app.listen(3000, () => console.log('app Server is now running on http://localhost:3000'))