

const KEYS = {
  USER: "user",
  CART: "cart",
  WISHLIST: "wishlist"
};

export const storage = {
  
  getUser: () => JSON.parse(localStorage.getItem(KEYS.USER)),
  setUser: (user) => localStorage.setItem(KEYS.USER, JSON.stringify(user)),
  clearUser: () => localStorage.removeItem(KEYS.USER),

  
  getCart: () => JSON.parse(localStorage.getItem(KEYS.CART)) || [],
  setCart: (cart) => localStorage.setItem(KEYS.CART, JSON.stringify(cart)),
  clearCart: () => localStorage.removeItem(KEYS.CART),

  
  getWishlist: () => JSON.parse(localStorage.getItem(KEYS.WISHLIST)) || [],
  setWishlist: (list) => localStorage.setItem(KEYS.WISHLIST, JSON.stringify(list)),
  clearWishlist: () => localStorage.removeItem(KEYS.WISHLIST)
};