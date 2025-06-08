import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   data: [],

}

export const foodDataSlice = createSlice({
    name: 'foodData',
    initialState,
    reducers: {
        setFoodData: (state, action) => {
            state.data = action.payload;
        },
    },
});

export const { setFoodData } = foodDataSlice.actions;
export default foodDataSlice.reducer;