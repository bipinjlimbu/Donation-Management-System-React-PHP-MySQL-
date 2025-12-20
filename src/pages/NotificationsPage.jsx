import { useState, useEffect } from "react";
import { useAuth } from "../components/AuthContext";
import LoginPage from "./LoginPage";
import axios from "axios";

export default function NotificationsPage() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        if (user?.user_id) {
            const fetchNotifications = async () => {
                setLoading(true);
                setError(null);
                try {
                    const res = await axios.post(
                        "http://localhost/dms/api/fetchNotifications.php",
                        { user_id: user.user_id }
                    );
                    if (res.data.success) {
                        setNotifications(res.data.notifications || []);
                    } else {
                        setError(res.data.message || "No notifications found.");
                    }
                } catch (err) {
                    console.error("Failed to fetch notifications:", err);
                    setError("Failed to connect to the server.");
                } finally {
                    setLoading(false);
                }
            };
            fetchNotifications();
        }
    }, [user]);

    if (!user) return <LoginPage />;

    return (
            <h1>Notifications</h1>
    );
}
