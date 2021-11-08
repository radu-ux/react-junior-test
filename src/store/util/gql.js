import { ApolloClient, InMemoryCache, gql } from '@apollo/client'

export const apolloClient = new ApolloClient({
    uri: 'http://localhost:4000/',
    cache: new InMemoryCache()
})

export const currenciesQuery = gql`
    query query { 
        currencies
    }
`
export const availableCategoriesQuery = gql`
    query query {
        categories {
            name
        }
    }
`

export const allCategoriesQuery = gql`
    query query {
        categories {
          name
          products {
            id
            name
            inStock
            gallery
            description
            category
            attributes {
              id
              name
              type
              items {
                displayValue
                value
                id
              }
            }
            prices {
              currency
              amount
            }
            brand
          }
        }
    }
`