import { configureStore } from '@reduxjs/toolkit';
import loginReducer from '../Features/Login/LoginSlice';
import foodDataReducer from '../Features/FoodData/FoodDataSlice';
import cartReducer from '../Features/CartSlice/CartSlice';
export const store = configureStore({
  reducer: {
    login: loginReducer,
    foodData: foodDataReducer,
    cart: cartReducer,
  },
});
export default store; 
