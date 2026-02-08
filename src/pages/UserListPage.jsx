import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../components/AuthContext";
import styles from "../style/UserList.module.css";

export default function UserListPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user: currentUser } = useAuth();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get("http://localhost/dms/api/fetchusers.php", { withCredentials: true });
                if (res.data.success) setUsers(res.data.users);
                else setError(res.data.message);
            } catch (err) {
                setError("Failed to connect to server");
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const deleteUser = async (targetRegisterId, targetUserId) => {
        if (!window.confirm("Are you sure you want to delete ONLY this specific record?")) return;

        try {
            const res = await axios.post(
                "http://localhost/dms/api/deleteuser.php",
                {
                    register_id: targetRegisterId,
                    user_id: targetUserId
                },
                { withCredentials: true }
            );

            if (res.data.success) {
                alert("Record removed successfully");
                setUsers((prev) => prev.filter((u) => u.register_id !== targetRegisterId));
            } else {
                alert(res.data.message);
            }
        } catch (err) {
            alert("Network error");
        }
    };

    return (
        <div className={styles.page}>
            {loading ? (<p className={styles.center}>Loading...</p>
            ) : error ? (<p className={styles.error}>{error}</p>
            ) : (
                <div className={styles.container}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u.register_id}>
                                    <td>{u.name}</td>
                                    <td>{u.email}</td>
                                    <td>{u.status}</td>
                                    <td>
                                        {u.user_id !== currentUser?.user_id ? (
                                            <button className={styles.deleteBtn} onClick={() => deleteUser(u.register_id, u.user_id)}>
                                                Delete
                                            </button>
                                        ) : (
                                            <span className={styles.meBadge}>Admin</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}