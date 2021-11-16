import { createSlice } from '@reduxjs/toolkit'

const initialState = { storeCurrency: 'USD', currencySwitcherState: false }

const currenciesSlice = createSlice({
    name: 'currencies',
    initialState, 
    reducers: {
        setStoreCurrency: (state, action) => { 
            state.storeCurrency = action.payload
        },

        setCurrencySwitcherState: (state, action) => {
            state.currencySwitcherState = action.payload
        }
    }
})

export const { setStoreCurrency, setCurrencySwitcherState } = currenciesSlice.actions
export default currenciesSlice.reducer