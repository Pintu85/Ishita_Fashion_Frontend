import { jwtDecode } from "jwt-decode";
import type { IJwtPayload }  from "../interfaces/jwt/jwt";

export const isValidJson = (jsonString: string) => {
  try {
    JSON.parse(jsonString);
    return true;
  } catch (error) {
    console.warn(error);
    return false;
  }
};

export const isNotNullUndefinedBlank = (data: any) => {
  return data !== null && data !== undefined && data.toString().trim() !== "";
};

export const isTokenExpired = (token: string) => {
  try {
    const decoded = jwtDecode<IJwtPayload>(token);
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};
