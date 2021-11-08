import currenciesSlice from "./slices/currenciesSlice"
import categoriesSlice from "./slices/categoriesSlice"
import cartSlice from "./slices/cartSlice"
import { configureStore } from "@reduxjs/toolkit"

const rootReducer = {currencies: currenciesSlice, categories: categoriesSlice, cart: cartSlice}
const store = configureStore({reducer: rootReducer})

export default store