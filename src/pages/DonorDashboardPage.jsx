import { useState, useEffect } from "react";
import axios from "axios";
import myDashboard from "../style/DashboardPage.module.css";
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";

export default function DonorDashboardPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`http://localhost/dms/api/fetchDonationHistory.php?user_id=${user.user_id}`)
            .then(res => {
                if (res.data.success) setRecords(res.data.donations);
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p>Loading Donor Dashboard...</p>;

    return (
        <div className={myDashboard.container}>
            <h1>{user.username} Dashboard</h1>

            <h2>Your Donation History</h2>
            {records.length > 0 ? (
                <>
                    <table>
                        <thead>
                            <tr>
                                <th>Campaign</th>
                                <th>Item</th>
                                <th>Qty</th>
                                <th>NGO</th>
                                <th>Location</th>
                                <th>Status</th>
                                <th>Delivered At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.slice(0, 3).map(rec => (
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
                    <button onClick={() => navigate("/records")}>View All Records</button>
                </>
            ) : <p>No donation history yet.</p>}
        </div>
    );
}
