import { createSlice } from "@reduxjs/toolkit";

const loadWishlist = () => {
  try {
    const data = localStorage.getItem("wishlist");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveWishlist = (items) => {
  localStorage.setItem("wishlist", JSON.stringify(items));
};

const initialState = {
  items: loadWishlist()
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlist: (state, action) => {
      const exists = state.items.find(i => i.id === action.payload.id);

      if (!exists) {
        state.items.push(action.payload);
        saveWishlist(state.items);
      }
    },

    removeFromWishlist: (state, action) => {
      state.items = state.items.filter(i => i.id !== action.payload);
      saveWishlist(state.items);
    },

    clearWishlist: (state) => {
      state.items = [];
      localStorage.removeItem("wishlist");
    }
  }
});

export const { addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;