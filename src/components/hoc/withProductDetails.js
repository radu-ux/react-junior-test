import React from "react"
import NetworkError from "../NetworkError"
import { apolloClient, GET_PRODUCT_BY_ID } from "../../util/queries"
import { ApolloProvider, Query } from "@apollo/react-components"

const withProductDetails = WrappedComponent => class extends React.Component { 
    render() { 
        return(
            <ApolloProvider client={apolloClient}>
                <Query query={GET_PRODUCT_BY_ID} variables={{productId: this.props.productId}} fetchPolicy="no-cache">
                    {
                        ({error, loading, data}) => { 
                            if(error) return <NetworkError />
                            if(loading || !data) return null
                           
                            if(data.product === null) { 
                                this.props.history.push("/error")
                                return null
                            }

                            return <WrappedComponent {...this.props} product={data.product}/>
                        }
                    }
                </Query>
            </ApolloProvider>
        )
    }
}

export default withProductDetails