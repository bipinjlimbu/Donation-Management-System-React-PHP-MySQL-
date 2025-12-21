import { useState, useEffect } from "react";
import { useAuth } from "../components/AuthContext";
import LoginPage from "./LoginPage";
import axios from "axios";
import myNotify from "../style/NotificationsPage.module.css";

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
    if (error) return <p className={myNotify.error}>{error}</p>;

    return (
        <div className={myNotify.container}>
            <h1 className={myNotify.heading}>Notifications</h1>

            {notifications.length === 0 ? (
                <p className={myNotify.empty}>No notifications available.</p>
            ) : (
                <ul className={myNotify.list}>
                    {notifications.map((n) => (
                        <li key={n.notification_id} className={myNotify.card}>
                            <div>
                                <h3 className={myNotify.title}>{n.title}</h3>
                                <span className={myNotify.date}>{n.created_at}</span>
                            </div>
                            <button
                                className={myNotify.viewBtn}
                                onClick={() => setSelectedNotification(n)}
                            >
                                View
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {selectedNotification && (
                <div className={myNotify.overlay}>
                    <div className={myNotify.modal}>
                        <h2>{selectedNotification.title}</h2>
                        <p>{selectedNotification.message}</p>

                        <button
                            className={myNotify.closeBtn}
                            onClick={() => setSelectedNotification(null)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}