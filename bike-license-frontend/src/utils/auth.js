import jwt_decode from "jwt-decode";

export const isTokenExpired = () => {
  const token = localStorage.getItem("token");
  if (!token) return true;

  try {
    const { exp } = jwt_decode(token);
    const now = Date.now() / 1000; 
    return exp < now; 
  } catch (error) {
    console.error("Token decoding error:", error);
    return true; 
  }
};
