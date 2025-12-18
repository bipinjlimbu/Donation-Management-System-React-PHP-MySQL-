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
        axios
            .get(`http://localhost/dms/api/fetchDonationHistory.php?user_id=${user.user_id}`)
            .then(res => {
                if (res.data.success) {
                    const donations = res.data.donations || [];

                    setPendingDonations(
                        donations.filter(d => d.status === "Pending")
                    );

                    setRecords(
                        donations.filter(d => d.status !== "Pending")
                    );
                }
            })
            .finally(() => setLoading(false));
    }, [user.user_id]);

    if (loading) return <p>Loading Donor Dashboard...</p>;

    return (
        <div className={myDashboard.container}>
            <h1>Donor Dashboard</h1>

            <div className={myDashboard.sectionCard}>
                <h2 className={myDashboard.sectionTitle}>Pending Donation Requests</h2>
                {pendingDonations.length > 0 ? (
                    pendingDonations.map(rec => (
                        <div key={rec.donation_id} className={myDashboard.pendingCard}>
                            <h2><strong>{rec.campaign_title}</strong></h2>
                            <p><strong>Item:</strong> {rec.item_name}</p>
                            <p><strong>Qty:</strong> {rec.quantity}</p>
                            <p><strong>NGO:</strong> {rec.ngo_name}</p>
                        </div>
                    ))
                ) : (
                    <p className={myDashboard.noData}>No pending donation requests.</p>
                )}
            </div>

            <div className={myDashboard.section}>
                <h2 className={myDashboard.sectionTitle}>Your Donation History</h2>
                {records.length > 0 ? (
                    <>
                        <table className={myDashboard.table}>
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
                        <button className={myDashboard.viewBtn} onClick={() => navigate("/records")}>
                            View All Records
                        </button>
                    </>
                ) : (
                    <p className={myDashboard.noData}>No donation history yet.</p>
                )}
            </div>
        </div>
    );
}
