export const loadAddresses = () => {
  try {
    return JSON.parse(localStorage.getItem("addresses")) || [];
  } catch {
    return [];
  }
};

export const saveAddresses = (addresses) => {
  localStorage.setItem("addresses", JSON.stringify(addresses));
};

export const loadSelectedId = () => {
  try {
    return JSON.parse(localStorage.getItem("selectedAddressId")) || null;
  } catch {
    return null;
  }
};

export const saveSelectedId = (id) => {
  localStorage.setItem("selectedAddressId", JSON.stringify(id));
};