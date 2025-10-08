import { jwtDecode } from "jwt-decode";

const storagePrefix = "ishita_fashion_";

const storage = {
  setToken: (token: string) => {
    localStorage.setItem(`${storagePrefix}token`, token);
  },
  getToken: () => {
    return localStorage.getItem(`${storagePrefix}token`) || "";
  },
  clearToken: () => {
    localStorage.removeItem(`${storagePrefix}token`);
  },
  getDecodedToken: () => {
    const token = storage.getToken();
    if (!token) return "";

    try {
      return jwtDecode(token);
    } catch (err) {
      console.warn("Invalid token", err);
      return "";
    }
  },
  setUser: (user: string) => {
    localStorage.setItem(`${storagePrefix}user`, JSON.stringify(user));
  },
  getUser: () => {
    const user = localStorage.getItem(`${storagePrefix}user`);
    return user ? JSON.parse(user) : null;
  },
  clearUser: () => {
    localStorage.removeItem(`${storagePrefix}user`);
  },
  setPreviousUrlPath: (path: string) => {
    window.localStorage.setItem(`${storagePrefix}previousUrl`, path);
  },
  getPreviousUrlPath: () => {
    return window.localStorage.getItem(`${storagePrefix}previousUrl`);
  },
  clearPreviousUrlPath: () => {
    window.localStorage.removeItem(`${storagePrefix}previousUrl`);
  },
};
export default storage ;
