import { getHeaders } from '../getItems/getAuthItems.js';
import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/api/admin`;

//admin dashboard stats
// Add this to apiAdmin.js
export const fetchAdminStats = async () => {
  try {
    const res = await axios.get(`${API_URL}/stats`, getHeaders());
    return res.data; // Expected: { totalNovels: 0, pendingRequests: 0, newUsersToday: 0, totalRevenue: 0 }
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to fetch stats");
  }
};
// Fetch one novel (for editing/details)
export const fetchNovelById = async (novelId) => {
  try {
    const res = await axios.get(`${API_URL}/novels/${novelId}`, getHeaders());
    return res.data; 
  } catch (error) {
    console.error("Error fetching novel:", error);
    return null;
  }
};

//fetch all moderation logs from db
// apiAdmin.js
export const getAllLogs = async () => {
  try {
    const res = await axios.get(`${API_URL}/logs`, getHeaders());
    // 🔥 Return the data directly so the component doesn't have to guess
    return res.data; 
  }
  catch (e) {
    console.error("API Error:", e);
    throw e; 
  }
}

// Fetch all novels for the admin table
export const fetchAllNovels = async () => {
  try {
    const res = await axios.get(`${API_URL}/novels`, getHeaders());

    // Case 1: Backend returns { novels: [...] }
    if (res.data && Array.isArray(res.data.novels)) {
      return res.data.novels;
    }

    // Case 2: Backend returns [...]
    if (Array.isArray(res.data)) {
      return res.data;
    }

    // Default: Return empty array if format is unrecognized
    return [];
  } catch (e) {
    console.error("Error fetching all novels:", e);
    return [];
  }
};
// apiNovel.js
export const deleteNovel = async (novelId, reason = "Admin Action") => {
  try {
    const res = await axios.delete(
      `${API_URL}/delete/${novelId}`, 
      {
        headers: getHeaders().headers,
        data: { reason } // DELETE bodies must be inside the 'data' key in Axios
      }
    );

    // If we reach here, the status is 2xx
    return res.data.success === true || res.status === 200;
  } catch (e) {
    console.error("Delete Error Details:", e.response?.data || e.message);
    return false;
  }
};

//Users Api
export const fetchAllUsers = async () => {
  try {
    const res = await axios.get(`${API_URL}/users`, getHeaders());

    // Case 1: Backend returns { users: [...] }
    if (res.data && Array.isArray(res.data.users)) {
      return res.data.users;
    }

    // Case 2: Backend returns [...]
    if (Array.isArray(res.data)) {
      return res.data;
    }

    // Default: Return empty array if format is unrecognized
    return [];
  } catch (e) {
    console.error("Error fetching all Users:", e);
    return [];
  }
};
// apiNovel.js
export const banUser = async (userId, reason = "Admin Action") => {
  try {
    const res = await axios.patch(
      `${API_URL}/ban/${userId}`, 
      { reason }, 
      getHeaders()
    );
    return res.data?.message || "User banned successfully";

  } catch (e) {
    console.error("Ban Error:", e.response?.data || e.message);
    throw new Error(e.response?.data?.message || "Failed to restrict user");
  }
};
export const liftban = async (userId) => {
  try {
    const res = await axios.patch(
      `${API_URL}/unban/${userId}`, 
      {}, // PATCH usually expects a body, even if empty
      getHeaders()
    );
    // Fixed: Changed "banned" to "unrestricted" or "lifted"
    return res.data?.message || "User access restored successfully";
  } catch (e) {
    console.error("Unban Error:", e.response?.data || e.message);
    throw new Error(e.response?.data?.message || "Failed to unban user");
  }
};