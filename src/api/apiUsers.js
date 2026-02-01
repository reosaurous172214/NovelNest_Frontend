import axios from "axios";
import { getHeaders } from "../getItems/getAuthItems.js";

export const fetchUsers = async () => {
    try{
        const res = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/auth`,
            getHeaders()
        );
        return res.data.users || [];
    }    catch(e){
        console.error("Users Fetch Error:", e.response?.data || e.message);
        return [];
    }
};

const API_URL = process.env.REACT_APP_API_URL;

export const fetchMyProfile = async () => {
    try {
        const res = await axios.get(`${API_URL}/api/auth/me`, getHeaders());
        // If your backend does res.json(user), use res.data. 
        // If it does res.json({ user }), use res.data.user.
        return res.data; 
    } catch (e) {
        console.error("Profile Fetch Error:", e.response?.data || e.message);
        return null;
    }
};

export const updateUserProfile = async (profileData) => {
    try {
        // When sending a profile picture, axios automatically sets 
        // multipart/form-data headers if profileData is a FormData object.
        const res = await axios.put(
            `${API_URL}/api/auth/updateProfile`, 
            profileData,
            getHeaders() 
        );
        return res.data;
    } catch (e) {
        console.error("Update Profile Error:", e.response?.data || e.message);
        throw e; // Throwing allows the component to catch and show an alert
    }
};