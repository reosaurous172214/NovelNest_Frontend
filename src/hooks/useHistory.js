import { useState, useCallback } from "react";
import axios from "axios";
import { getHeaders } from "../getItems/getAuthItems";

export default function useGetHistory() {
    const API_URL = `${process.env.REACT_APP_API_URL}/api/lib/history`;
    const [getting, setGetting] = useState(false);

    // ✅ useCallback ensures the function reference doesn't change
    // This stops the infinite re-fetch loop in the Dashboard
    const getLastRead = useCallback(async () => {
        setGetting(true);
        try {
            const res = await axios.get(API_URL, getHeaders());
            if (!res.data || res.data.length === 0) return null;
            return res.data; 
        } catch (e) {
            console.error("Get History Error:", e);
            throw e; 
        } finally {
            setGetting(false); 
        }
    }, [API_URL]); // Only changes if API_URL changes

    return { getLastRead, getting };
}