export const loadCartFromStorage = () => {
  try {
    const data = localStorage.getItem("cart");
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Load failed:", error);
    return [];
  }
};

export const saveCartToStorage = (items) => {
  try {
    localStorage.setItem("cart", JSON.stringify(items));
  } catch (error) {
    console.error("Save failed:", error);
  }
};

export const clearCartFromStorage = () => {
  try {
    localStorage.removeItem("cart");
  } catch (error) {
    console.error("Clear failed:", error);
  }
};