import axios from "axios";
import { getHeaders } from "../getItems/getAuthItems.js";

export const fetchUserActivity = async () => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/activities`,
      getHeaders() // Reusing your dynamic header logic
    );

    // Defensive programming: ensure we return an array even if the response is weird
    return res.data?.activities || res.data || [];
  } catch (error) {
    console.error("Dashboard Activity Fetch Error:", error.response?.data || error.message);
    
    // If unauthorized, you might want to handle it specifically
    if (error.response?.status === 401) {
       return "UNAUTHORIZED"; 
    }
    
    return [];
  }
};
export const fetchReadingTime = async () => {
  try{
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/activities/time`,
      getHeaders()
    );
    return res.data?.hours || 0;
  }
  catch(e){
    console.error("Reading Time Fetch Error:", e.response?.data || e.message);
  }
};