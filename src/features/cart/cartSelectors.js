import { createSelector } from "@reduxjs/toolkit";

export const selectCartItems = (state) => state.cart.items;   

export const selectCartArray = selectCartItems;

export const selectCartTotalPrice = createSelector(
  [selectCartItems],
  (items) =>
    items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    )
);