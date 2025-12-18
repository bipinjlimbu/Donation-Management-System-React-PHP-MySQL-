import { useState, useEffect } from "react";
import axios from "axios";
import myDashboard from "../style/NgoDashboardPage.module.css";
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";

export default function NgoDashboardPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [donationRequests, setDonationRequests] = useState([]);
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const donationReq = await axios.get(
                `http://localhost/dms/api/fetchDonationRequests.php?user_id=${user.user_id}`
            );
            const history = await axios.get(
                `http://localhost/dms/api/fetchDonationHistory.php?user_id=${user.user_id}`
            );

            if (donationReq.data.success) setDonationRequests(donationReq.data.donations);
            if (history.data.success) setRecords(history.data.donations);

            setLoading(false);
        };
        load();
    }, []);

    const handleApprove = async (req, e) => {
        e.preventDefault();

        const res = await axios.post(
            "http://localhost/dms/api/approveDonationRequest.php",
            {
                donation_id: req.donation_id,
                campaign_id: req.campaign_id,
                quantity: req.quantity
            }
        );

        if (res.data.success)
            setDonationRequests(prev =>
                prev.filter(r => r.donation_id !== req.donation_id)
            );
    };

    const handleDeny = async (req) => {
        const res = await axios.post(
            "http://localhost/dms/api/denyDonationRequest.php",
            { donation_id: req.donation_id }
        );

        if (res.data.success)
            setDonationRequests(prev =>
                prev.filter(r => r.donation_id !== req.donation_id)
            );
    };

    if (loading) return <p>Loading NGO Dashboard...</p>;

    return (
        <div className={myDashboard.container}>
            <h1 className={myDashboard.heading}>NGO Dashboard</h1>

            <div className={myDashboard.section}>
                <h2 className={myDashboard.sectionTitle}>
                    Pending Donation Approvals
                </h2>

                {donationRequests.length > 0 ? (
                    <div className={myDashboard.cardGrid}>
                        {donationRequests.map(req => (
                            <div key={req.pending_id} className={myDashboard.requestCard}>
                                <h3 className={myDashboard.cardTitle}>
                                    {req.campaign_title}
                                </h3>

                                <p><strong>Donor:</strong> {req.donor}</p>
                                <p><strong>Quantity:</strong> {req.quantity}</p>

                                <div className={myDashboard.cardActions}>
                                    <button
                                        className={myDashboard.approveButton}
                                        onClick={(e) => handleApprove(req, e)}
                                    >
                                        Approve
                                    </button>

                                    <button
                                        className={myDashboard.denyButton}
                                        onClick={() => handleDeny(req)}
                                    >
                                        Deny
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className={myDashboard.centerText}>
                        No pending donation requests.
                    </p>
                )}
            </div>

            <div className={myDashboard.section}>
                <h2 className={myDashboard.sectionTitle}>Donation Records</h2>

                {records.length > 0 ? (
                    <>
                        <table className={myDashboard.table}>
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

                        <button
                            className={myDashboard.viewBtn}
                            onClick={() => navigate("/records")}
                        >
                            View All Records
                        </button>
                    </>
                ) : (
                    <p className={myDashboard.centerText}>
                        No donation records.
                    </p>
                )}
            </div>
        </div>
    );
}
