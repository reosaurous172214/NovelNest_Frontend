import axios from 'axios';
import { getHeaders } from "../getItems/getAuthItems.js";
const API_URL = `${process.env.REACT_APP_API_URL}/api/notifications`;

export const notificationApi = {
  // Get the list for the dropdown
  getAll: async () => {
    const res = await axios.get(API_URL,getHeaders());
    return res.data;
  },
  // Mark one or all as read
  markAsRead: async (id = null) => {
    const url = id ? `${API_URL}/read/${id}` : `${API_URL}/read`;
    const res = await axios.patch(url,{},getHeaders());
    return res.data;
  },
  // Clear the whole history
  clearAll: async () => {
    const res = await axios.delete(`${API_URL}/clear-all`,getHeaders());
    return res.data;
  }
};