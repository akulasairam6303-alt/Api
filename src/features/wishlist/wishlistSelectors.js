export const selectWishlistItems = state => state.wishlist.items;

export const selectWishlistCount = state =>
  state.wishlist.items.length;