import { useState, useEffect } from "react";
import { useAuth } from "../components/AuthContext";
import myRecords from "../style/RecordsPage.module.css";
import axios from "axios";

export default function RecordsPage() {
    const { user } = useAuth();
    const [records, setRecords] = useState([]);
    const [filteredRecords, setFilteredRecords] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user || !user.user_id) return;

        const fetchHistory = async () => {
            setLoading(true);
            setError(null);

            try {
                const res = await axios.get(`http://localhost/dms/api/fetchDonationHistory.php?user_id=${user.user_id}`);

                if (res.data.success) {
                    setRecords(res.data.donations || []);
                    setFilteredRecords(res.data.donations || []); // store both
                } else {
                    setError(res.data.message || "No donation records found.");
                }
            } catch (err) {
                console.error("Failed to fetch donation history:", err);
                setError("Failed to connect to the server.");
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [user]);

    const role = user?.role;

    const filter = () => {
        const filterValue = document.getElementById("filter").value;

        if (filterValue === "all") {
            setFilteredRecords(records);
        } else {
            const newList = records.filter(
                (rec) => rec.status.toLowerCase() === filterValue.toLowerCase()
            );
            setFilteredRecords(newList);
        }
    };

    return (
        <div className={myRecords.container}>
            <h1>Records of Donations</h1>

            {loading && <p>Loading donation records...</p>}
            {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}

            {!loading && !error && filteredRecords.length === 0 && (
                <p>No Records of Donations.</p>
            )}

            <div className={myRecords.filterBar}>
                <select name="filter" id="filter">
                    <option value="all">All Records</option>
                    <option value="denied">Denied</option>
                    <option value="delivered">Delivered</option>
                </select>
                <button onClick={filter}>Apply Filter</button>
            </div>

            {!loading && filteredRecords.length > 0 && role === "Admin" && (
                <table>
                    <thead>
                        <tr>
                            <th>Campaign</th>
                            <th>Item Name</th>
                            <th>Quantity</th>
                            <th>Donor</th>
                            <th>NGO</th>
                            <th>Location</th>
                            <th>Status</th>
                            <th>Delivered At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRecords.map((rec) => (
                            <tr key={rec.donation_id}>
                                <td>{rec.campaign_title}</td>
                                <td>{rec.item_name}</td>
                                <td>{rec.quantity}</td>
                                <td>{rec.donor_name}</td>
                                <td>{rec.ngo_name}</td>
                                <td>{rec.ngo_address}</td>
                                <td>{rec.status}</td>
                                <td>{rec.delivered_at || "-"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {!loading && filteredRecords.length > 0 && role === "Donor" && (
                <table>
                    <thead>
                        <tr>
                            <th>Campaign</th>
                            <th>Item Name</th>
                            <th>Quantity</th>
                            <th>NGO</th>
                            <th>Location</th>
                            <th>Status</th>
                            <th>Delivered At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRecords.map((rec) => (
                            <tr key={rec.donation_id}>
                                <td>{rec.campaign_title}</td>
                                <td>{rec.item_name}</td>
                                <td>{rec.quantity}</td>
                                <td>{rec.ngo_name}</td>
                                <td>{rec.ngo_address}</td>
                                <td>{rec.status}</td>
                                <td>{rec.delivered_at || "-"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {!loading && filteredRecords.length > 0 && role === "NGO" && (
                <table>
                    <thead>
                        <tr>
                            <th>Campaign</th>
                            <th>Item Name</th>
                            <th>Quantity</th>
                            <th>Donor</th>
                            <th>Location</th>
                            <th>Status</th>
                            <th>Delivered At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRecords.map((rec) => (
                            <tr key={rec.donation_id}>
                                <td>{rec.campaign_title}</td>
                                <td>{rec.item_name}</td>
                                <td>{rec.quantity}</td>
                                <td>{rec.donor_name}</td>
                                <td>{rec.ngo_address}</td>
                                <td>{rec.status}</td>
                                <td>{rec.delivered_at || "-"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
