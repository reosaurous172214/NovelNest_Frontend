import { getHeaders } from '../getItems/getAuthItems.js';
import axios from 'axios';

export const fetchChapter = async (novelId, chapterno) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/chapters/${novelId}/num/${chapterno}`,
      getHeaders()
    );
    // CRITICAL FIX: You must return the data
    return res.data; 
  } catch (error) {
    console.error("Error fetching chapter:", error);
    return ;
  }
};