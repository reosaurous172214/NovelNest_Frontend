import axios from "axios";
import { getHeaders } from "../getItems/getAuthItems.js";
export async function addFavourites(novelId) {
    try {
        const res = await axios.post(
            `${process.env.REACT_APP_API_URL}/api/lib/favourites/add/${novelId}`, 
            {},
            getHeaders()  
        );
        return res.data;
    } catch (error) {
        console.error("Error adding Favourite:", error.response?.data || error.message);
        throw error; 
    }
}
export async function removeFavourites(novelId){
    try{    
        const res = await axios.delete(`${process.env.REACT_APP_API_URL}/api/lib/favourites/remove/${novelId}`, 
            getHeaders()
        );
        return res.data;
    }
    catch(e){
        console.error("Error removing Favourite:", e);
    }
}