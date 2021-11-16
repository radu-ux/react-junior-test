import React from "react"
import NetworkError from "../NetworkError"
import { apolloClient, GET_CATEGORY_BY_NAME } from "../../util/queries"
import { ApolloProvider, Query } from "@apollo/react-components"

const withCategory = WrappedComponent => class extends React.Component { 
    render() {
        
        return (
            <ApolloProvider client={apolloClient} >
                <Query query={GET_CATEGORY_BY_NAME} variables={{categoryInput: {title: this.props.selectedCategory}}} fetchPolicy="no-cache">
                    {
                        ({error, loading, data}) => {
                            if(error) return <NetworkError />
                            if(loading || !data) return null
                            
                            if(data.category === null) { 
                                this.props.history.push("/error")
                                return null
                            }
                            return <WrappedComponent {...this.props} category={data.category}/>
                        }
                    }
                </Query>
            </ApolloProvider>
        )
    }
}

export default withCategory