import { createSlice, nanoid } from "@reduxjs/toolkit";

const savedAddresses = JSON.parse(localStorage.getItem("addresses")) || [];
const savedSelectedId = JSON.parse(localStorage.getItem("selectedAddressId"));

const initialState = {
  addresses: savedAddresses,
  selectedAddressId: savedSelectedId || null
};

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    addAddress: {
      reducer: (state, action) => {
        state.addresses.push(action.payload);

        localStorage.setItem(
          "addresses",
          JSON.stringify(state.addresses)
        );
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

      localStorage.setItem(
        "addresses",
        JSON.stringify(state.addresses)
      );
    },

    selectAddress: (state, action) => {
      state.selectedAddressId = action.payload;

      localStorage.setItem(
        "selectedAddressId",
        JSON.stringify(state.selectedAddressId)
      );
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

      localStorage.setItem(
        "addresses",
        JSON.stringify(state.addresses)
      );
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