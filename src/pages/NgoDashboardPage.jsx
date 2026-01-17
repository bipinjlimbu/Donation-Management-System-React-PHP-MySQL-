import { useState, useEffect } from "react";
import axios from "axios";
import styles from "../style/NGODashboardPage.module.css"; // reuse same CSS
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";

export default function NgoDashboardPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [donationRequests, setDonationRequests] = useState([]);
    const [records, setRecords] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            try {
                const [donationRes, historyRes] = await Promise.all([
                    axios.get("http://localhost/dms/api/fetchDonationRequests.php", { withCredentials: true }),
                    axios.get(`http://localhost/dms/api/fetchDonationHistory.php?user_id=${user.user_id}`, { withCredentials: true }),
                ]);

                if (donationRes.data.success) setDonationRequests(donationRes.data.donations || []);
                if (historyRes.data.success) setRecords(historyRes.data.donations || []);
            } catch {
                setError("Failed loading NGO dashboard data.");
            }
        };

        fetchData();
    }, [user]);

    const handleApprove = async (req) => {
        try {
            const res = await axios.post(
                "http://localhost/dms/api/approveDonationRequest.php",
                {
                    donation_id: req.donation_id,
                    campaign_id: req.campaign_id,
                    quantity: req.quantity
                },
                { withCredentials: true }
            );
            if (res.data.success)
                setDonationRequests(prev => prev.filter(r => r.donation_id !== req.donation_id));
        } catch { }
    };

    const handleDeny = async (req) => {
        try {
            const res = await axios.post(
                "http://localhost/dms/api/denyDonationRequest.php",
                { donation_id: req.donation_id },
                { withCredentials: true }
            );
            if (res.data.success)
                setDonationRequests(prev => prev.filter(r => r.donation_id !== req.donation_id));
        } catch { }
    };

    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>NGO Dashboard</h1>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Pending Donation Requests</h2>
                {donationRequests.length > 0 ? (
                    <div className={styles.cardGrid}>
                        {donationRequests.map(req => (
                            <div key={req.donation_id} className={styles.requestCard}>
                                <div className={styles.cardHeaderUnderline}>
                                    <span>{req.campaign_title}</span>
                                </div>
                                <div className={styles.cardBody}>
                                    <p><b>Donor:</b> {req.donor_name}</p>
                                    <p><b>Item:</b> {req.item_name}</p>
                                    <p><b>Quantity:</b> {req.quantity}</p>
                                    <p><b>Status:</b> {req.status}</p>
                                    <p><b>Requested At:</b> {req.requested_at}</p>
                                </div>
                                <div className={styles.cardFooter}>
                                    <button className={styles.approveBtn} onClick={() => handleApprove(req)}>Approve</button>
                                    <button className={styles.denyBtn} onClick={() => handleDeny(req)}>Deny</button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : <p>No pending donation requests.</p>}
            </div>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Donation History</h2>
                {records.length > 0 ? (
                    <>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Campaign</th>
                                    <th>Item</th>
                                    <th>Qty</th>
                                    <th>Donor</th>
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
                                        <td>{rec.donor_name}</td>
                                        <td>{rec.status}</td>
                                        <td>{rec.delivered_at || "-"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button className={styles.viewBtn} onClick={() => navigate("/records")}>View All Records</button>
                    </>
                ) : <p>No donation history.</p>}
            </div>
        </div>
    );
}
