import { useState, useEffect } from "react";
import axios from "axios";
import myDashboard from "../style/DonorDashboardPage.module.css";
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";

export default function DonorDashboardPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [pendingDonations, setPendingDonations] = useState([]);
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const load = async () => {
            try {
                const pendingRes = await axios.get(
                    "http://localhost/dms/api/fetchDonationRequests.php",
                    { withCredentials: true }
                );

                if (pendingRes.data.success) {
                    setPendingDonations(pendingRes.data.donations || []);
                }

                const historyRes = await axios.get(
                    `http://localhost/dms/api/fetchDonationHistory.php?user_id=${user.user_id}`
                );

                if (historyRes.data.success) {
                    setRecords(
                        (historyRes.data.donations || []).filter(
                            d => d.status !== "Pending"
                        )
                    );
                }
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [user]);

    if (loading) return <p>Loading Donor Dashboard...</p>;

    return (
        <div className={myDashboard.container}>
            <h1>Donor Dashboard</h1>

            <div className={myDashboard.sectionCard}>
                <h2 className={myDashboard.sectionTitle}>
                    Pending Donation Requests
                </h2>

                {pendingDonations.length > 0 ? (
                    <div className={myDashboard.cardGrid}>
                        {pendingDonations.map(req => (
                            <div
                                key={req.donation_id}
                                className={myDashboard.requestCard}
                            >
                                <h3 className={myDashboard.cardTitle}>
                                    {req.campaign_title}
                                </h3>

                                <p><strong>Item:</strong> {req.item_name}</p>
                                <p><strong>Quantity:</strong> {req.quantity}</p>
                                <p><strong>NGO:</strong> {req.ngo_name}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className={myDashboard.noData}>
                        No pending donation requests.
                    </p>
                )}
            </div>

            <div className={myDashboard.section}>
                <h2 className={myDashboard.sectionTitle}>
                    Your Donation History
                </h2>

                {records.length > 0 ? (
                    <>
                        <table className={myDashboard.table}>
                            <thead>
                                <tr>
                                    <th>Campaign</th>
                                    <th>Item</th>
                                    <th>Qty</th>
                                    <th>NGO</th>
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
                                        <td>{rec.status}</td>
                                        <td>{rec.delivered_at || "-"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <button
                            className={myDashboard.viewBtn}
                            onClick={() => navigate("/records")}
                        >
                            View All Records
                        </button>
                    </>
                ) : (
                    <p className={myDashboard.noData}>
                        No donation history yet.
                    </p>
                )}
            </div>
        </div>
    );
}
