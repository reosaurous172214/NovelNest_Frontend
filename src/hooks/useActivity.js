import { useState, useEffect } from "react";
import { fetchUserActivity, fetchReadingTime } from "../api/activity";

export default function useActivity() {
  const [activities, setActivities] = useState([]);
  const [hours, setHours] = useState("0.0");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch both simultaneously for better performance
        const [activityData, timeData] = await Promise.all([
          fetchUserActivity(),
          fetchReadingTime()
        ]);
        
        setActivities(activityData);
        setHours(timeData);
      } catch (err) {
        console.error("Dashboard Sync Error", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  return { activities, loading, hours };
}