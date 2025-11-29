import { useState, useEffect } from "react";
import axios from "axios";
import myDashboard from "../style/DashboardPage.module.css";
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminDashboardPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [signupRequests, setSignupRequests] = useState([]);
    const [userRequests, setUserRequests] = useState([]);
    const [campaignRequests, setCampaignRequests] = useState([]);
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [signRes, userRes, campRes, historyRes] = await Promise.all([
                    axios.get("http://localhost/dms/api/fetchSignupRequests.php"),
                    axios.get("http://localhost/dms/api/fetchUserRequests.php"),
                    axios.get("http://localhost/dms/api/fetchCampaignRequests.php"),
                    axios.get(`http://localhost/dms/api/fetchDonationHistory.php?user_id=${user.user_id}`)
                ]);

                if (signRes.data.success) setSignupRequests(signRes.data.requests);
                if (userRes.data.success) setUserRequests(userRes.data.requests);
                if (campRes.data.success) setCampaignRequests(campRes.data.requests);
                if (historyRes.data.success) setRecords(historyRes.data.donations);

            } catch {
                setError("Failed loading admin dashboard data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSignupApprove = async (id) => {
        const res = await axios.post("http://localhost/dms/api/approveSignup.php", { register_id: id });
        if (res.data.success)
            setSignupRequests(prev => prev.filter(r => r.register_id !== id));
    };

    const handleSignupDeny = async (id) => {
        const res = await axios.post("http://localhost/dms/api/denySignup.php", { register_id: id });
        if (res.data.success)
            setSignupRequests(prev => prev.filter(r => r.register_id !== id));
    };

    const handleUserApprove = async (id, role) => {
        const res = await axios.post("http://localhost/dms/api/approveUserRequest.php", { user_id: id, role });
        if (res.data.success)
            setUserRequests(prev => prev.filter(r => r.user_id !== id));
    };

    const handleUserDeny = async (id, role) => {
        const res = await axios.post("http://localhost/dms/api/denyUserRequest.php", { user_id: id, role });
        if (res.data.success)
            setUserRequests(prev => prev.filter(r => r.user_id !== id));
    };

    const handleCampaignApprove = async (campaign_id) => {
        const res = await axios.post("http://localhost/dms/api/approveCampaignRequest.php", { campaign_id });
        if (res.data.success)
            setCampaignRequests(prev => prev.filter(r => r.campaign_id !== campaign_id));
    };

    const handleCampaignDeny = async (campaign_id) => {
        const res = await axios.post("http://localhost/dms/api/denyCampaignRequest.php", { campaign_id });
        if (res.data.success)
            setCampaignRequests(prev => prev.filter(r => r.campaign_id !== campaign_id));
    };

    if (loading) return <p>Loading Admin Dashboard...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div className={myDashboard.container}>
            <h1>Admin Dashboard</h1>

            <h2>New Signup Requests</h2>
            {signupRequests.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Registration #</th>
                            <th>Requested At</th>
                            <th>Approve</th>
                            <th>Deny</th>
                        </tr>
                    </thead>
                    <tbody>
                        {signupRequests.map(r => (
                            <tr key={r.register_id}>
                                <td>{r.email}</td>
                                <td>{r.role}</td>
                                <td>{r.role === "NGO" ? r.registration_number : "-"}</td>
                                <td>{r.requested_at}</td>
                                <td><button className={myDashboard.approveButton} onClick={() => handleSignupApprove(r.register_id)}>Approve</button></td>
                                <td><button className={myDashboard.denyButton} onClick={() => handleSignupDeny(r.register_id)}>Deny</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : <p>No new signup requests.</p>}

            <h2>User Profile Change Requests</h2>
            {userRequests.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>User ID</th>
                            <th>Role</th>
                            <th>Current Name</th>
                            <th>New Name</th>
                            <th>Current Phone</th>
                            <th>New Phone</th>
                            <th>Current Address</th>
                            <th>New Address</th>
                            <th>Status</th>
                            <th>Requested At</th>
                            <th>Approve</th>
                            <th>Deny</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userRequests.map(req => (
                            <tr key={req.user_id}>
                                <td>{req.user_id}</td>
                                <td>{req.role}</td>
                                <td>{req.current_name}</td>
                                <td>{req.new_name}</td>
                                <td>{req.current_phone}</td>
                                <td>{req.new_phone}</td>
                                <td>{req.current_address}</td>
                                <td>{req.new_address}</td>
                                <td>{req.status}</td>
                                <td>{req.requested_at}</td>
                                <td><button className={myDashboard.approveButton} onClick={() => handleUserApprove(req.user_id, req.role)}>Approve</button></td>
                                <td><button className={myDashboard.denyButton} onClick={() => handleUserDeny(req.user_id, req.role)}>Deny</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : <p>No user requests.</p>}

            <h2>Campaign Creation Requests</h2>
            {campaignRequests.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Target Qty</th>
                            <th>Status</th>
                            <th>Requested By</th>
                            <th>Requested At</th>
                            <th>Approve</th>
                            <th>Deny</th>
                        </tr>
                    </thead>
                    <tbody>
                        {campaignRequests.map(req => (
                            <tr key={req.campaign_id}>
                                <td>{req.title}</td>
                                <td>{req.description}</td>
                                <td>{req.target_quantity}</td>
                                <td>{req.status}</td>
                                <td>{req.ngo_name}</td>
                                <td>{req.requested_at}</td>
                                <td><button className={myDashboard.approveButton} onClick={() => handleCampaignApprove(req.campaign_id)}>Approve</button></td>
                                <td><button className={myDashboard.denyButton} onClick={() => handleCampaignDeny(req.campaign_id)}>Deny</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : <p>No campaign requests.</p>}

            <h2>Donation History</h2>
            {records.length > 0 ? (
                <>
                    <table>
                        <thead>
                            <tr>
                                <th>Campaign</th>
                                <th>Item</th>
                                <th>Qty</th>
                                <th>Donor</th>
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
                                    <td>{rec.donor_name}</td>
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
            ) : <p>No donation history.</p>}

        </div>
    );
}
