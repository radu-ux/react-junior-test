import { ApolloClient, InMemoryCache, gql } from '@apollo/client'

export const apolloClient = new ApolloClient({
    uri: 'http://localhost:4000/',
    cache: new InMemoryCache()
})

// Query to filter categories by name
export const GET_CATEGORY_BY_NAME = gql`
query($categoryInput: CategoryInput!) {
    category(input: $categoryInput){
        name,
        products{
        id,
        name,
        inStock,
        gallery,
        category,
        attributes{
          id,
          name,
          type,
            items{
            displayValue,
            value,
            id
          }
        },
        prices{
            currency,
            amount
        },
        brand
        }
    }
}
`

//Query to get the names for all categories
export const GET_CATEGORIES_NAME = gql`
query {
    categories{
      name
    }
  }
`
// Query to filter products by id
export const GET_PRODUCT_BY_ID = gql`
query($productId: String!) {
    product(id: $productId) {
      id,
      name, 
      inStock,
      gallery,
      description,
      category,
      attributes{
        id,
        name,
        type,
          items{
          displayValue,
          value,
          id
        }
      },
      prices{
        currency,
        amount
      },
      brand
    }
  }
` 

// Query to get the available store currencies
export const GET_CURRENCIES = gql`
  query {
    currencies
  }
`