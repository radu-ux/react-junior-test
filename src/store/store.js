import currenciesSlice from "./slices/currenciesSlice"
import categoriesSlice from "./slices/categoriesSlice"
import cartSlice from "./slices/cartSlice"
import backdropSlice from "./slices/backdropSlice"
import { configureStore } from "@reduxjs/toolkit"

const rootReducer = {currency: currenciesSlice, category: categoriesSlice, cart: cartSlice, backdrop: backdropSlice}
const store = configureStore({reducer: rootReducer})

export default store