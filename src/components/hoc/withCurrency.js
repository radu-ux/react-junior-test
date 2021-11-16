import React from "react"
import NetworkError from "../NetworkError"
import { apolloClient, GET_CURRENCIES } from "../../util/queries"
import { ApolloProvider, Query } from "@apollo/react-components"

const withCurrency = WrappedComponent => class extends React.Component { 
    render() {
        return (
            <ApolloProvider client={apolloClient}>
                <Query query={GET_CURRENCIES}>
                    {
                        ({error, loading, data}) => { 
                            if(error) return <NetworkError />
                            if(loading || !data) return null
                            
                            if(data.currencies === null) { 
                                this.props.history.push("/error")
                                return null
                            }

                            return <WrappedComponent currencies={data.currencies}/>
                        }
                    }
                </Query>
            </ApolloProvider>
        )
    }
}

export default withCurrency