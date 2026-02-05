import { getHeaders } from '../getItems/getAuthItems.js';
import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/api/admin`;

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
      `${process.env.REACT_APP_API_URL}/api/admin/delete/${novelId}`, 
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