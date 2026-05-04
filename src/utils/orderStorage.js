// orderStorage.js

export const loadOrders = () => {
  try {
    return JSON.parse(localStorage.getItem("orders")) || [];
  } catch {
    return [];
  }
};

export const saveOrders = (orders) => {
  localStorage.setItem("orders", JSON.stringify(orders));
};

export const updateOrder = (id, updates) => {
  const orders = loadOrders();

  const updated = orders.map(order =>
    order.id === id ? { ...order, ...updates } : order
  );

  saveOrders(updated);
  return updated;
};

export const loadCurrentOrder = () => {
  try {
    return JSON.parse(localStorage.getItem("currentOrder"));
  } catch {
    return null;
  }
};

export const saveCurrentOrder = (order) => {
  localStorage.setItem("currentOrder", JSON.stringify(order));
};