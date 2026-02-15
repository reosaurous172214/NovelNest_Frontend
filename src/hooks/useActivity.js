import { useState, useEffect, useCallback } from "react";
// Using your existing API imports
import { fetchUserActivity, fetchReadingTime } from "../api/activity";

export default function useActivity(userId) {
  const [activities, setActivities] = useState([]);
  const [hours, setHours] = useState("0.0");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  // Memoize the loader so it can be called safely from useEffect or Dashboard
  const loadDashboardData = useCallback(async () => {
    // Prevent fetching if no token is present
    if (!token) return;
    
    setLoading(true);
    try {
      const [activityData, timeData] = await Promise.all([
        fetchUserActivity(),
        fetchReadingTime()
      ]);
      
      setActivities(activityData || []);
      setHours(timeData || "0.0");
    } catch (err) {
      console.error("Activity Hook Sync Error:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Automatically fetch when the userId becomes available (on login)
  useEffect(() => {
    if (userId && token) {
      loadDashboardData();
    }
  }, [userId,token, loadDashboardData]);

  return { activities, loading, hours, refresh: loadDashboardData };
}