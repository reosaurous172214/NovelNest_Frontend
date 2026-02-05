import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}/api/comments`;

// Helper for headers (assuming you store token in localStorage)
const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
});

export const commentApi = {
    // Get all comments for a specific novel
    getByNovel: async (novelId) => {
        const response = await axios.get(`${API_URL}/${novelId}`);
        return response.data;
    },
    getByUser: async (userId) => {
        const response = await axios.get(`${API_URL}/${userId}`);
        return response.data;
    },

    // Post a new comment
    post: async (novelId, content) => {
        const response = await axios.post(API_URL, { novelId, content }, getAuthHeaders());
        return response.data;
    },
    // Edit comment
    edit : async(commentId,novelId,content) =>{
        const res = await axios.put(`${API_URL}/${commentId}`,{novelId,content}, getAuthHeaders());
        return res.data;
    },

    // Delete a comment
    remove: async (commentId) => {
        const response = await axios.delete(`${API_URL}/${commentId}`, getAuthHeaders());
        return response.data;
    },
    update: async (commentId) =>{
        const res = await axios.put(`${API_URL}/${commentId}`, getAuthHeaders());
        return res.data;
    },
    vote: async (commentId, voteType) => {
        const response = await axios.patch(`${API_URL}/${commentId}/vote`, { voteType }, getAuthHeaders());
        return response.data;
    },

    postReply: async (commentId, content, novelId) => {
        const response = await axios.post(`${API_URL}/${commentId}/replies`, { content, novelId }, getAuthHeaders());
        return response.data;
    }
};