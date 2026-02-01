import { useEffect, useState } from "react";
import { fetchMyProfile, updateUserProfile, fetchUsers } from "../api/apiUsers";

export function useGetMyProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try{
        const data = await fetchMyProfile();
        setUser(data);
      setLoading(false);
      }
        catch(e){
        console.error("Profile Load Error:", e);
        setLoading(false);
      }
        
    };
    loadProfile();
  }, []);
  return { user, loading };
}

export function useUpdateMyProfile() {
  const [updating, setUpdating] = useState(false);
    const updateProfile = async (profileData) => {
    setUpdating(true);
    try{
        const updatedProfile = await updateUserProfile(profileData);
        setUpdating(false);
        return updatedProfile;
    } catch(e){
        console.error("Profile Update Error:", e);
        setUpdating(false);
        return null;
    }
    };
    return { updateProfile, updating };
}