import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import myRecords from "../style/RecordsPage.module.css"
import axios from "axios";

export default function RecordsPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [records, setRecords] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user || !user.user_email)
            return;

        const fetchHistory = async () => {
            setLoading(true);
            setError(null);
            try {
                const email = user.user_email;
                const res = await axios.get(`http://localhost/dms/api/fetchHistory.php?email=${email}`);
                if (res.data.success) {
                    setRecords(res.data.donations || []);
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

    return (
        <div className={myRecords.container}>
            <h1>Records of Donations</h1>

            {loading && <p>Loading donation records...</p>}
            {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}

            {!loading && !error && records.length === 0 && <p>No Records of Donations.</p>}

            {!loading && records.length > 0 && (
                <table>
                    <thead>
                        <tr>
                            <th>Campaign Name</th>
                            <th>Item Type</th>
                            <th>Quantity</th>
                            <th>NGO</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.map((rec) => (
                        <tr key={rec.dh_id}>
                            <td>{rec.campaign_name}</td>
                            <td>{rec.item_type}</td>
                            <td>{rec.item_quantity}</td>
                            <td>@{rec.ngo}</td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
