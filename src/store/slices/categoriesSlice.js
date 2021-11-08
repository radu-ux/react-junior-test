import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { apolloClient, availableCategoriesQuery, allCategoriesQuery } from "../util/gql"

const initialState = {
    categories: [],
    currentCategory: undefined,
    areCategoriesFetched: false
}

export const fetchAvailableCategories = createAsyncThunk('categories/fetchAvailableCategories', async () => {
    const allCategoriesQueryResponse = await apolloClient.query({query: allCategoriesQuery})
    const availableCategoriesQueryResponse = await apolloClient.query({query: availableCategoriesQuery})
    return {categories: allCategoriesQueryResponse.data.categories, availableCategories: availableCategoriesQueryResponse.data.categories}
})

const categoriesSlice = createSlice({
    name: 'categories',
    initialState, 
    reducers: {
        setCurrentCategory: (state, action) => {
            const categoryName = action.payload
            state.currentCategory = state.categories.find(category => category.name === categoryName)
        }
    },
    extraReducers: (build) => { 
        build.addCase(fetchAvailableCategories.fulfilled, (state, action) => {
            state.categories = action.payload.categories
            state.areCategoriesFetched = true
        })
    }
})

export const { setCurrentCategory } = categoriesSlice.actions
export default categoriesSlice.reducer