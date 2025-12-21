import { useState, useEffect } from "react";
import { useAuth } from "../components/AuthContext";
import LoginPage from "./LoginPage";
import axios from "axios";
import styles from "../style/NotificationsPage.module.css";

export default function NotificationsPage() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedNotification, setSelectedNotification] = useState(null);

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
                } catch {
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
        <div className={styles.container}>
            <h1 className={styles.heading}>Notifications</h1>

            {loading && <p className={styles.info}>Loading notifications...</p>}
            {error && <p className={styles.error}>{error}</p>}

            {!loading && notifications.length === 0 && (
                <p className={styles.info}>No notifications available.</p>
            )}

            <div className={styles.list}>
                {notifications.map((n) => (
                    <div key={n.id} className={styles.card}>
                        <div className={styles.text}>
                            <h3 className={styles.title}>{n.title}</h3>
                            <p className={styles.date}>
                                {new Date(n.created_at).toLocaleString()}
                            </p>
                        </div>

                        <button
                            className={styles.viewBtn}
                            onClick={() => setSelectedNotification(n)}
                        >
                            View
                        </button>
                    </div>
                ))}
            </div>

            {selectedNotification && (
                <div
                    className={styles.overlay}
                    onClick={() => setSelectedNotification(null)}
                >
                    <div
                        className={styles.modal}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2>{selectedNotification.title}</h2>
                        <p className={styles.modalMsg}>
                            {selectedNotification.message}
                        </p>
                        <button
                            className={styles.closeBtn}
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
