import { useState } from "react";
import axios from "axios";
import { getHeaders } from "../getItems/getAuthItems";
export default function useGetHistory() {
    const API_URL = `${process.env.REACT_APP_API_URL}/api/lib/history`
    const [getting, setGetting] = useState(false);

    const getLastRead = async () => { // Changed name to match your NovelCard call
        setGetting(true);
        try {
            const res = await axios.get(API_URL,getHeaders());
            if (!res.data || res.data.length === 0) return null;
            return res.data; // Success: returns { message: "..." }
        } catch (e) {
            console.error("Get History Error:", e);
            throw e; // 🔥 CRITICAL: Allows NovelCard's catch block to show the error alert
        } finally {
            setGetting(false); // ✅ finally ensures loading stops even if it fails
        }
    };

    return { getLastRead, getting };
}