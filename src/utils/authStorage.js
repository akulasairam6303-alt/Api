
const AUTH_KEY = "auth_user";

export const loadAuth = () => {
    const data = localStorage.getItem(AUTH_KEY);
    try {
    return data ? JSON.parse(data) : null;
  } catch (e){
    return null;
  }
};

export const saveAuth = (authData) => {
  localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
  if (authData.token) {
        localStorage.setItem("token", authData.token);
  }
};

export const clearAuth = () => {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem("token");
};