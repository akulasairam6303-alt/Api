import { createSelector } from "@reduxjs/toolkit";

export const selectCartItems = state => state.cart.items;

export const selectCartArray = createSelector(
  [selectCartItems],
  items => Object.values(items)
);

export const selectCartTotalPrice = createSelector(
  [selectCartArray],
  items =>
    items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    )
);