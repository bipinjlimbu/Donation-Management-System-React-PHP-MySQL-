import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../components/AuthContext";
import styles from "../style/UserList.module.css";

export default function UserListPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { user } = useAuth();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get(
                    "http://localhost/dms/api/get_users.php",
                    { withCredentials: true }
                );
                if (res.data.success) setUsers(res.data.users);
                else setError(res.data.message);
            } catch (err) {
                console.error(err);
                setError("Failed to connect to server");
            } finally {
                setLoading(false);
            }
        };

        if (user?.role !== "Admin") {
            setError("Unauthorized: Admins only.");
            setLoading(false);
        } else {
            fetchUsers();
        }
    }, [user]);

    const deleteUser = async (registerId, userId) => {
        if (!window.confirm("Are you sure you want to delete this specific record?")) return;

        try {
            const res = await axios.post(
                "http://localhost/dms/api/delete_user.php",
                {
                    register_id: registerId,
                    user_id: userId
                },
                { withCredentials: true }
            );

            if (res.data.success) {
                alert("Record removed successfully");
                // Update UI by filtering out the specific register_id
                setUsers((prev) => prev.filter((u) => u.register_id !== registerId));
            } else {
                alert(res.data.message);
            }
        } catch (err) {
            alert("Network error");
        }
    };

    return (
        <div className={styles.page}>
            {loading ? (
                <p className={styles.center}>Loading records...</p>
            ) : error ? (
                <p className={styles.error}>{error}</p>
            ) : (
                <div className={styles.container}>
                    <h2 className={styles.title}>User Management</h2>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u.register_id}>
                                    <td>{u.name}</td>
                                    <td>{u.email}</td>
                                    <td>{u.role}</td>
                                    <td>
                                        <span className={`${styles.statusBadge} ${styles[u.status.toLowerCase()]}`}>
                                            {u.status}
                                        </span>
                                    </td>
                                    <td>
                                        {u.user_id !== user.user_id ? (
                                            <button
                                                className={styles.deleteBtn}
                                                onClick={() => deleteUser(u.register_id, u.user_id)}
                                            >
                                                Delete
                                            </button>
                                        ) : (
                                            <span className={styles.meBadge}>Current Admin</span>
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