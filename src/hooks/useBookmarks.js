 import {addBookmark,removeBookmark} from "../api/bookmarks";
import { useEffect, useState } from "react";

export function useAddBookmark() {
    const [adding, setAdding] = useState(false);

    const addToBookmark = async (novelId) => { // Changed name to match your NovelCard call
        setAdding(true);
        try {
            const res = await addBookmark(novelId);
            return res; // Success: returns { message: "..." }
        } catch (e) {
            console.error("Add Bookmark Error:", e);
            throw e; // 🔥 CRITICAL: Allows NovelCard's catch block to show the error alert
        } finally {
            setAdding(false); // ✅ finally ensures loading stops even if it fails
        }
    };

    return { addToBookmark, adding };
}