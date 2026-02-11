import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../components/AuthContext";
import styles from "../style/UserList.module.css";

export default function UserListPage() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [statusFilter, setStatusFilter] = useState("all");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { user: currentUser } = useAuth();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get(
                    "http://localhost/dms/api/fetchusers.php",
                    { withCredentials: true }
                );

                if (res.data.success) {
                    setUsers(res.data.users);
                    setFilteredUsers(res.data.users);
                } else {
                    setError(res.data.message);
                }
            } catch {
                setError("Failed to connect to server");
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        if (statusFilter === "all") {
            setFilteredUsers(users);
        } else {
            setFilteredUsers(
                users.filter(
                    u => u.status.toLowerCase() === statusFilter
                )
            );
        }
    }, [statusFilter, users]);

    const deleteUser = async (registerId, userId) => {
        if (!window.confirm("Are you sure you want to delete ONLY this record?")) return;

        try {
            const res = await axios.post(
                "http://localhost/dms/api/deleteuser.php",
                { register_id: registerId, user_id: userId },
                { withCredentials: true }
            );

            if (res.data.success) {
                setUsers(prev => prev.filter(u => u.register_id !== registerId));
            } else {
                alert(res.data.message);
            }
        } catch {
            alert("Network error");
        }
    };

    return (
        <div className={styles.page}>
            {loading ? (
                <p className={styles.center}>Loading...</p>
            ) : error ? (
                <p className={styles.error}>{error}</p>
            ) : (
                <div className={styles.container}>
                    <h1 className={styles.title}>Users</h1>

                    <div className={styles.filterButtons}>
                        <button
                            className={`${styles.filterBtn} ${statusFilter === "all" ? styles.active : ""
                                }`}
                            onClick={() => setStatusFilter("all")}
                        >
                            All
                        </button>

                        <button
                            className={`${styles.filterBtn} ${statusFilter === "approved" ? styles.active : ""
                                }`}
                            onClick={() => setStatusFilter("approved")}
                        >
                            Approved
                        </button>

                        <button
                            className={`${styles.filterBtn} ${statusFilter === "denied" ? styles.active : ""
                                }`}
                            onClick={() => setStatusFilter("denied")}
                        >
                            Denied
                        </button>
                    </div>

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
                            {filteredUsers.map(u => (
                                <tr key={u.register_id}>
                                    <td>{u.name}</td>
                                    <td>{u.email}</td>
                                    <td>
                                        <span
                                            className={`${styles.statusBadge} ${styles[u.status.toLowerCase()]
                                                }`}
                                        >
                                            {u.status}
                                        </span>
                                    </td>
                                    <td>
                                        {u.user_id !== currentUser?.user_id ? (
                                            <button
                                                className={styles.deleteBtn}
                                                onClick={() =>
                                                    deleteUser(u.register_id, u.user_id)
                                                }
                                            >
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
