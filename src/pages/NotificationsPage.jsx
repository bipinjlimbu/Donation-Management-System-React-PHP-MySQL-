import { useState, useEffect } from "react";
import { useAuth } from "../components/AuthContext";
import LoginPage from "./LoginPage";
import axios from "axios";

export default function NotificationsPage() {
    const { user } = useAuth();

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedNotification, setSelectedNotification] = useState(null);

    useEffect(() => {
        if (!user?.user_id) return;

        const fetchNotifications = async () => {
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
                setError("Failed to connect to server.");
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, [user]);

    if (!user) return <LoginPage />;
    if (loading) return <p>Loading notifications...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div>
            <h1>Notifications</h1>

            {notifications.length === 0 ? (
                <p>No notifications available.</p>
            ) : (
                <ul>
                    {notifications.map((n) => (
                        <li key={n.notification_id} style={{ marginBottom: "12px" }}>
                            <strong>{n.title}</strong>
                            <br />
                            <button onClick={() => setSelectedNotification(n)}>
                                View
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {selectedNotification && (
                <div style={overlayStyle}>
                    <div style={modalStyle}>
                        <h3>{selectedNotification.title}</h3>
                        <p>{selectedNotification.message}</p>

                        <button onClick={() => setSelectedNotification(null)}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}