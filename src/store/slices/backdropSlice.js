import { createSlice } from "@reduxjs/toolkit"

const initialState = { backdropClassName: "backdrop-visible", headerZIndex: 70 }

const backdropSlice = createSlice({
    name: "backdrop",
    initialState,
    reducers: {
        setBackdropVisibility: (state, action) => { 
            state.backdropClassName = action.payload
        },

        setHeaderZIndex: (state, action) => { 
            state.headerZIndex = action.payload
        }
    }
})

export const { setBackdropVisibility, setHeaderZIndex } = backdropSlice.actions
export default backdropSlice.reducer