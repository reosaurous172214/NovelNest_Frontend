import axios from "axios";
import { getHeaders } from "../getItems/getAuthItems.js";
export async function addBookmark(novelId) {
    try {
        const res = await axios.post(
            `${process.env.REACT_APP_API_URL}/api/lib/bookmarks/add/${novelId}`, 
            {},
            getHeaders()  
        );
        return res.data;
    } catch (error) {
        console.error("Error adding bookmark:", error.response?.data || error.message);
        throw error; 
    }
}
export async function removeBookmark(novelId){
    try{    
        const res = await axios.delete(`${process.env.REACT_APP_API_URL}/api/lib/bookmarks/remove/${novelId}`, 
            getHeaders()
        );
        return res.data;
    }
    catch(e){
        console.error("Error removing bookmark:", e);
    }
}