
const AUTH_KEY = "auth_user";

export const loadAuth = () => {
  try {
    const data = localStorage.getItem(AUTH_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const saveAuth = (authData) => {
  localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
};

export const clearAuth = () => {
  localStorage.removeItem(AUTH_KEY);
};