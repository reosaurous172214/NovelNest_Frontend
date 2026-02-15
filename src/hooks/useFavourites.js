 import {addFavourites} from "../api/favourites";
import { useState } from "react";

export function useAddFavourites() {
    const [adding, setAdding] = useState(false);

    const addToFavourites = async (novelId) => { // Changed name to match your NovelCard call
        setAdding(true);
        try {
            const res = await addFavourites(novelId);
            return res; // Success: returns { message: "..." }
        } catch (e) {
            console.error("Add Favourite Error:", e);
            throw e; // 🔥 CRITICAL: Allows NovelCard's catch block to show the error alert
        } finally {
            setAdding(false); // ✅ finally ensures loading stops even if it fails
        }
    };

    return { addToFavourites, adding };
}