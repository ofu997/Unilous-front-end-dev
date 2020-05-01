import React from 'react';
import ReactDOM from 'react-dom';
import { renderToString } from 'react-dom/server'
import { HelmetProvider } from 'react-helmet-async'
import App from './App';
import { Provider } from 'react-redux'
import store from './store'
import { ApolloClient } from 'apollo-client'
import { ApolloProvider } from "@apollo/react-hooks"
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { setContext } from 'apollo-link-context'
// https://projectu-back-end-2020.herokuapp.com/graphql
// https://cakecrusher-projectu-back-end.glitch.me/graphql
// https://localhost:4000/graphql
const renderApp = () => {
    const httpLink = createHttpLink({
        uri: 'https://projectu-back-end-2020.herokuapp.com/graphql',
    })
    
    const authLink = setContext((_, { headers }) => {
        const token = localStorage.getItem('token')
        return {
            headers: {
                ...headers,
                authorization: token ? `berySecret ${token}` : null,
            }
        }
    })

    const client = new ApolloClient({
        link: authLink.concat(httpLink),
        cache: new InMemoryCache()
    })

    return (
            ReactDOM.render(
                <ApolloProvider client={client}>
                    <Provider store={store}>
                        <HelmetProvider>
                            <App />
                        </HelmetProvider>
                    </Provider>
                </ApolloProvider>,
                document.getElementById('root')
            )
    )
}

renderApp()

store.subscribe(() => (
    renderApp()
))