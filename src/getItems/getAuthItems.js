// src/getItems/getAuthItems.js
export const getHeaders = () => {
  const token = localStorage.getItem("token");

  // If no token, return an empty object or just basic content type
  if (!token) {
    return {
      headers: {
        "Content-Type": "application/json",
      },
    };
  }

  // If token exists, attach it
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getToken = () => {
  return localStorage.getItem("token");
};