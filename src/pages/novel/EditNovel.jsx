import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function EditNovel() {
    const { id } = useParams();

    const [novel, setNovel] = useState(null);
    const [chapters, setChapters] = useState([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [editingId, setEditingId] = useState(null);

    const authConfig = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    };

    useEffect(() => {
        fetchNovel();
    }, []);

    const fetchNovel = async () => {
        try {
            const res = await axios.get(
                `http://localhost:5000/api/novels/${id}`,
                authConfig
            );
            setNovel(res.data);
            setChapters(res.data.chapters || []);
        } catch (err) {
            console.error(err);
        }
    };

    const addOrUpdateChapter = async () => {
        if (!title || !content) return;

        try {
            if (editingId) {
                await axios.put(
                    `http://localhost:5000/api/chapters/${editingId}`,
                    { title, content },
                    authConfig
                );
            } else {
                await axios.post(
                    "http://localhost:5000/api/chapters",
                    {
                        novelId: id,
                        title,
                        content,
                    },
                    authConfig
                );
                await axios.put(
                    `http://localhost:5000/api/novels/${id}/incrementChapters`,
                    {
                        incrementBy: 1,
                    },
                    authConfig
                );
            }

            setTitle("");
            setContent("");
            setEditingId(null);
            fetchNovel();
        } catch (err) {
            console.error(err);
        }
    };

    const editChapter = (ch) => {
        setTitle(ch.title);
        setContent(ch.content);
        setEditingId(ch._id);
    };

    const deleteChapter = async (chapterId) => {
        try {
            await axios.delete(
                `http://localhost:5000/api/chapters/${chapterId}`,
                authConfig
            );
            fetchNovel();
        } catch (err) {
            console.error(err);
        }
    };

    if (!novel) {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
                Loading...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8 pt-16">
            {/* Novel Info */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold">{novel.title}</h1>
                <p className="text-gray-400 mt-2">{novel.description}</p>
            </div>

            {/* Add / Edit Chapter */}
            <div className="bg-gray-800 p-6 rounded-lg mb-10">
                <h2 className="text-xl font-semibold mb-4">
                    {editingId ? "Edit Chapter" : "Add New Chapter"}
                </h2>

                <input
                    type="text"
                    placeholder="Chapter Title"
                    className="w-full mb-4 p-3 bg-gray-700 rounded outline-none"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <textarea
                    placeholder="Chapter Content"
                    className="w-full mb-4 p-3 bg-gray-700 rounded outline-none h-40"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />

                <button
                    onClick={addOrUpdateChapter}
                    className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded"
                >
                    {editingId ? "Update Chapter" : "Add Chapter"}
                </button>
            </div>

            {/* Chapters List */}
            <h2 className="text-2xl font-semibold mb-4">Chapters</h2>

            {chapters.length === 0 ? (
                <p className="text-gray-400">No chapters added yet.</p>
            ) : (
                chapters.map((ch, idx) => (
                    <div
                        key={ch._id}
                        className="bg-gray-800 p-4 rounded-lg mb-3 flex justify-between items-center"
                    >
                        <div>
                            <h3 className="font-semibold">
                                {idx + 1}. {ch.title}
                            </h3>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => editChapter(ch)}
                                className="text-yellow-400 hover:underline"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => deleteChapter(ch._id)}
                                className="text-red-400 hover:underline"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
