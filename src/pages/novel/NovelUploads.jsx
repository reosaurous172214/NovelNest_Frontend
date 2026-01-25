import { useEffect, useState } from "react";
import axios from "axios";
import { FaPlus } from "react-icons/fa";
import NovelRow from "../../components/novel/NovelSlip";

export default function NovelUploads() {
  const [novels, setNovels] = useState([]);

  useEffect(() => {
    const fetchNovels = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/novels/my",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setNovels(res.data.novels);
      } catch (error) {
        console.error(error);
      }
    };
    fetchNovels();
  }, []);

  const editHandler = (id) => {
    window.location.href = `/novel/edit/${id}`;
  };

  const createHandler = () => {
    window.location.href = `/novel/create`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white flex justify-center pt-16">
      
      <div className="w-full max-w-5xl px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-3xl font-bold">
            📖 Your <span className="text-blue-400">Uploads</span>
          </h1>

          <button
            onClick={createHandler}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-xl shadow-lg transition"
          >
            <FaPlus />
            New Novel
          </button>
        </div>

        {/* Uploads */}
        <div className="space-y-6">
          {novels.length === 0 ? (
            <div className="bg-gray-900 rounded-2xl p-10 text-center text-gray-400 shadow-lg">
              You haven’t uploaded any novels yet.
            </div>
          ) : (
            novels.map((novel) => (
              <div
                key={novel._id}
                className="bg-gray-900 rounded-2xl shadow-lg hover:shadow-xl transition"
              >
                <NovelRow novel={novel} showActions={true} onEdit={editHandler} />
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
