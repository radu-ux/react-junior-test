import React from "react"
import NetworkError from "../NetworkError"
import { apolloClient, GET_CATEGORIES_NAME } from "../../util/queries"
import { ApolloProvider, Query } from "@apollo/react-components"

const withCategoriesName = WrappedComponent => class extends React.Component { 
    render() { 
        return(
            <ApolloProvider client={apolloClient}>
                <Query query={GET_CATEGORIES_NAME}>
                    {
                        ({error, loading, data}) => { 
                            if(error) return <NetworkError />
                            if(loading || !data) return null

                            if(data.categories === null) { 
                                this.props.history.push("/error")
                                return null
                            }

                            return <WrappedComponent {...this.props} categories={data.categories}/>
                        }
                    }
                </Query>
            </ApolloProvider>
        )
    }
}

export default withCategoriesName