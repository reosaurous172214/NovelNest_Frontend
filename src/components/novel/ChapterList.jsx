import {useState, useEffect} from "react";
import axios from "axios";

export default function ChapterList({ novelId }) {
    const [chapters, setChapters] = useState([]);

    useEffect(() => {
        const fetchChapters = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/chapters/${novelId}`);
                setChapters(response.data);
            } catch (error) {
                console.error("Error fetching chapters:", error);
            }
        };

        fetchChapters();
    }, [novelId]);

    return (
        <div>
            {chapters.map(chapter => (
                <div key={chapter._id}>
                    <h2>{chapter.title}</h2>
                    <p>{chapter.content}</p>
                </div>
            ))}
        </div>
    );
}