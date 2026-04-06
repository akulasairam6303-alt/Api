import { createSlice } from "@reduxjs/toolkit";

const loadCartFromStorage = () => {
  try {
    const data = localStorage.getItem("cart");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveCartToStorage = items => {
  localStorage.setItem("cart", JSON.stringify(items));
};

const initialState = {
  items: loadCartFromStorage()
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {

    addToCart: (state, action) => {
      const item = action.payload;

      const existing = state.items.find(i => i.id === item.id);

      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({
          ...item,
          quantity: 1
        });
      }

      saveCartToStorage(state.items);
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter(i => i.id !== action.payload);
      saveCartToStorage(state.items);
    },

    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;

      const item = state.items.find(i => i.id === id);

      if (item && quantity > 0) {
        item.quantity = quantity;
      }

      saveCartToStorage(state.items);
    },

    clearCart: state => {
      state.items = [];
      saveCartToStorage([]);
    },

    incrementQuantity: (state, action) => {
      const item = state.items.find(i => i.id === action.payload);
      if (item) {
        item.quantity += 1;
      }
      saveCartToStorage(state.items);
    },

    decrementQuantity: (state, action) => {
      const item = state.items.find(i => i.id === action.payload);
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          state.items = state.items.filter(i => i.id !== action.payload);
        }
      }
      saveCartToStorage(state.items);
    }
  }
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  incrementQuantity,
  decrementQuantity
} = cartSlice.actions;

export default cartSlice.reducer;