import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  addresses: [],
  selectedAddressId: null
};

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    addAddress: {
      reducer: (state, action) => {
        state.addresses.push(action.payload);
      },
      prepare: (address) => ({
        payload: {
          id: nanoid(),
          ...address
        }
      })
    },

    deleteAddress: (state, action) => {
      state.addresses = state.addresses.filter(
        a => a.id !== action.payload
      );
    },

    selectAddress: (state, action) => {
      state.selectedAddressId = action.payload;
    },

    updateAddress: (state, action) => {
      const index = state.addresses.findIndex(
        a => a.id === action.payload.id
      );

      if (index !== -1) {
        state.addresses[index] = {
          ...state.addresses[index],
          ...action.payload
        };
      }
    }
  }
});

export const {
  addAddress,
  deleteAddress,
  selectAddress,
  updateAddress
} = addressSlice.actions;

export default addressSlice.reducer;