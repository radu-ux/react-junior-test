import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apolloClient, currenciesQuery } from '../util/gql'

const initialState = { currencies: [], currentCurrency: '' }

export const fetchCurrencies = createAsyncThunk('currencies/fetchCurrencies', async () => {
    const response = await apolloClient.query({query: currenciesQuery})
    return response.data.currencies
})

const currenciesSlice = createSlice({
    name: 'currencies',
    initialState, 
    reducers: {
        setCurrentCurrency: (state, action) => { 
            state.currentCurrency = action.payload
        }
    },
    extraReducers: (build) => { 
        build.addCase(fetchCurrencies.fulfilled, (state, action) => { 
            state.currencies = action.payload
            state.currentCurrency = action.payload.find(currency => currency === 'USD')
        })
    }
})

export const { setCurrentCurrency } = currenciesSlice.actions
export default currenciesSlice.reducer