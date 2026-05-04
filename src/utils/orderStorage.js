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

// ADD THIS FUNCTION
export const addOrder = (order) => {
  const orders = loadOrders();
  // We spread the existing orders and add the new one
  const updatedOrders = [...orders, order];
  saveOrders(updatedOrders);
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