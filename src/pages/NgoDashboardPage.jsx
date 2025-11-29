import { useState, useEffect } from "react";
import axios from "axios";
import myDashboard from "../style/DashboardPage.module.css";
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
            const donationReq = await axios.get(`http://localhost/dms/api/fetchDonationRequests.php?user_id=${user.user_id}`);
            const history = await axios.get(`http://localhost/dms/api/fetchDonationHistory.php?user_id=${user.user_id}`);

            if (donationReq.data.success) setDonationRequests(donationReq.data.donations);
            if (history.data.success) setRecords(history.data.donations);

            setLoading(false);
        };
        load();
    }, []);

    const handleApprove = async (req, e) => {
        e.preventDefault();

        const res = await axios.post("http://localhost/dms/api/approveDonationRequest.php", {
            donation_id: req.donation_id,
            campaign_id: req.campaign_id,
            quantity: req.quantity
        });

        if (res.data.success)
            setDonationRequests(prev => prev.filter(r => r.donation_id !== req.donation_id));
    };

    const handleDeny = async (req) => {
        const res = await axios.post("http://localhost/dms/api/denyDonationRequest.php", {
            donation_id: req.donation_id
        });

        if (res.data.success)
            setDonationRequests(prev => prev.filter(r => r.donation_id !== req.donation_id));
    };

    if (loading) return <p>Loading NGO Dashboard...</p>;

    return (
        <div className={myDashboard.container}>
            <h1>{user.username} Dashboard</h1>

            <h2>Pending Donation Approvals</h2>
            {donationRequests.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Campaign</th>
                            <th>Qty</th>
                            <th>Donor</th>
                            <th>Approve</th>
                            <th>Deny</th>
                        </tr>
                    </thead>
                    <tbody>
                        {donationRequests.map(req => (
                            <tr key={req.pending_id}>
                                <td>{req.campaign_title}</td>
                                <td>{req.quantity}</td>
                                <td>{req.donor}</td>
                                <td><button className={myDashboard.approveButton} onClick={(e) => handleApprove(req, e)}>Approve</button></td>
                                <td><button className={myDashboard.denyButton} onClick={() => handleDeny(req)}>Deny</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : <p>No pending donation requests.</p>}

            <h2>Donation Records</h2>
            {records.length > 0 ? (
                <>
                    <table>
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
                    <button onClick={() => navigate("/records")}>View All Records</button>
                </>
            ) : <p>No donation records.</p>}
        </div>
    );
}
