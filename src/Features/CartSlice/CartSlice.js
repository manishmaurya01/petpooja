import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: [],
  totalQuantity: 0,
  totalPrice: 0,
};

const round = (value) => Number(value.toFixed(2));

export const CartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existingItem = state.cart.find((cartItem) => cartItem.id === item.id);

      const price = parseFloat(item.food_price);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cart.push({ ...item, quantity: 1 });
      }

      state.totalQuantity += 1;
      state.totalPrice = round(state.totalPrice + price);
    },

    removeFromCart: (state, action) => {
      const itemId = action.payload;
      const item = state.cart.find((i) => i.id === itemId);
      if (item) {
        const price = parseFloat(item.food_price);
        state.totalQuantity -= item.quantity;
        state.totalPrice = round(state.totalPrice - price * item.quantity);
        state.cart = state.cart.filter((i) => i.id !== itemId);
      }
    },

    increaseQuantity: (state, action) => {
      const item = state.cart.find(i => i.id === action.payload);
      if (item) {
        const price = parseFloat(item.food_price);
        item.quantity += 1;
        state.totalQuantity += 1;
        state.totalPrice = round(state.totalPrice + price);
      }
    },

    decreaseQuantity: (state, action) => {
      const item = state.cart.find(i => i.id === action.payload);
      if (item) {
        const price = parseFloat(item.food_price);

        if (item.quantity > 1) {
          item.quantity -= 1;
          state.totalQuantity -= 1;
          state.totalPrice = round(state.totalPrice - price);
        } else {
          // If quantity is 1, remove the item
          state.totalQuantity -= 1;
          state.totalPrice = round(state.totalPrice - price);
          state.cart = state.cart.filter((i) => i.id !== item.id);
        }
      }
    },

    clearCart: (state) => {
      state.cart = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} = CartSlice.actions;

export default CartSlice.reducer;
