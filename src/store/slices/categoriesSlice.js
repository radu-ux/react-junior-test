import { createSlice, } from "@reduxjs/toolkit"

const initialState = {
    currentCategory: undefined
}

const categoriesSlice = createSlice({
    name: 'categories',
    initialState, 
    reducers: {
        setCurrentCategory: (state, action) => {
            state.currentCategory = action.payload
        }
    }
})

export const { setCurrentCategory } = categoriesSlice.actions
export default categoriesSlice.reducer