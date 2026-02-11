import { useState, useEffect } from "react";
import { useAuth } from "../components/AuthContext";
import myRecords from "../style/RecordsPage.module.css";
import LoginPage from "./LoginPage";
import axios from "axios";

export default function RecordsPage() {
    const { user } = useAuth();

    const [records, setRecords] = useState([]);
    const [filteredRecords, setFilteredRecords] = useState([]);
    const [statusFilter, setStatusFilter] = useState("all");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user || !user.user_id) return;

        const fetchHistory = async () => {
            setLoading(true);
            setError(null);

            try {
                const res = await axios.get(
                    `http://localhost/dms/api/fetchDonationHistory.php?user_id=${user.user_id}`
                );

                if (res.data.success) {
                    setRecords(res.data.donations || []);
                    setFilteredRecords(res.data.donations || []);
                } else {
                    setError(res.data.message || "No donation records found.");
                }
            } catch {
                setError("Failed to connect to the server.");
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [user]);

    useEffect(() => {
        if (statusFilter === "all") {
            setFilteredRecords(records);
        } else {
            setFilteredRecords(
                records.filter(
                    r => r.status.toLowerCase() === statusFilter
                )
            );
        }
    }, [statusFilter, records]);

    if (!user) return <LoginPage />;

    const role = user.role;

    return (
        <div className={myRecords.container}>
            <h1>Donation Records</h1>
            <div className={myRecords.filterButtons}>
                <button
                    className={`${myRecords.filterBtn} ${statusFilter === "all" ? myRecords.active : ""
                        }`}
                    onClick={() => setStatusFilter("all")}
                >
                    All
                </button>

                <button
                    className={`${myRecords.filterBtn} ${statusFilter === "delivered" ? myRecords.active : ""
                        }`}
                    onClick={() => setStatusFilter("delivered")}
                >
                    Delivered
                </button>

                <button
                    className={`${myRecords.filterBtn} ${statusFilter === "denied" ? myRecords.active : ""
                        }`}
                    onClick={() => setStatusFilter("denied")}
                >
                    Denied
                </button>
            </div>

            {loading && <p>Loading donation records...</p>}
            {error && <p className={myRecords.error}>{error}</p>}

            {!loading && filteredRecords.length === 0 && (
                <p>No donation records found.</p>
            )}

            {!loading && filteredRecords.length > 0 && (
                <div className={myRecords.tableWrapper}>
                    <table>
                        <thead>
                            <tr>
                                <th>Campaign</th>
                                <th>Item</th>
                                <th>Qty</th>

                                {role !== "Donor" && <th>Donor</th>}
                                {role !== "NGO" && <th>NGO</th>}

                                <th>Location</th>
                                <th>Status</th>
                                <th>Delivered At</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredRecords.map(rec => (
                                <tr key={rec.donation_id}>
                                    <td>{rec.campaign_title}</td>
                                    <td>{rec.item_name}</td>
                                    <td>{rec.quantity}</td>

                                    {role !== "Donor" && <td>{rec.donor_name}</td>}
                                    {role !== "NGO" && <td>{rec.ngo_name}</td>}

                                    <td>{rec.ngo_address}</td>
                                    <td>
                                        <span
                                            className={`${myRecords.status} ${myRecords[rec.status.toLowerCase()]
                                                }`}
                                        >
                                            {rec.status}
                                        </span>
                                    </td>
                                    <td>{rec.delivered_at || "-"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
