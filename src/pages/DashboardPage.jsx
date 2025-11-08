import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import myDashboard from "../style/DashboardPage.module.css";
import axios from "axios";

export default function DashboardPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [requests, setRequests] = useState([]);
    const [records, setRecords] = useState([]);
    const [userRequests, setUserRequests] = useState([]);
    const [campaignRequests, setCampaignRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!user?.user_id) return;
        const fetchData = async () => {
            setLoading(true);
            setError("");
            try {
                const [profileRes, pendingRes, historyRes, userReqRes, campaignReqRes] = await Promise.all([
                    axios.get(`http://localhost/dms/api/profile.php?user_id=${user.user_id}`),
                    axios.get(`http://localhost/dms/api/donationPending.php?user_id=${user.user_id}`),
                    axios.get(`http://localhost/dms/api/fetchHistory.php?user_id=${user.user_id}`),
                    axios.get("http://localhost/dms/api/fetchUserPending.php"),
                    axios.get("http://localhost/dms/api/fetchCampaignPending.php")
                ]);

                if (profileRes.data.success) setProfile(profileRes.data.profile);
                if (pendingRes.data.success) setRequests(pendingRes.data.donations);
                if (historyRes.data.success) setRecords(historyRes.data.donations);
                if (userReqRes.data.success) setUserRequests(userReqRes.data.requests || []);
                if (campaignReqRes.data.success) setCampaignRequests(campaignReqRes.data.requests || []);
            } catch (err) {
                setError("Failed to connect to the server.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    const handleApprove = async (req, e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost/dms/api/donationHistory.php", {
                donation_id: req.donation_id,
                campaign_name: req.campaign_name,
                item_type: req.item_type,
                quantity: req.donated_quantity,
                donor: req.donor,
                ngo: req.ngo,
            });
            if (res.data.success) setRequests(prev => prev.filter(r => r.donation_id !== req.donation_id));
            else alert("Approval failed: " + res.data.message);
        } catch (err) {
            alert("Network or server error during donation.");
        }
    };

    const handleDeny = async (req) => {
        if (!window.confirm("Are you sure you want to deny this donation?")) return;
        try {
            const res = await axios.post("http://localhost/dms/api/deletePending.php", { donation_id: req.donation_id });
            if (res.data.success) setRequests(prev => prev.filter(r => r.donation_id !== req.donation_id));
            else alert("Failed to deny donation: " + res.data.message);
        } catch (err) {
            alert("Network or server error during denial.");
        }
    };

    const handleUserApprove = async (pending_id, new_username, new_role, user_id) => {
        try {
            const res = await axios.post("http://localhost/dms/api/approveUserRequest.php", { pending_id, new_username, new_role, user_id });
            if (res.data.success) setUserRequests(prev => prev.filter(r => r.pending_id !== pending_id));
            else alert(res.data.message);
        } catch (err) {
            alert("Error approving user request.");
        }
    };

    const handleUserDeny = async (pending_id) => {
        try {
            const res = await axios.post("http://localhost/dms/api/denyUserRequest.php", { pending_id });
            if (res.data.success) setUserRequests(prev => prev.filter(r => r.pending_id !== pending_id));
            else alert(res.data.message);
        } catch (err) {
            alert("Error denying user request.");
        }
    };

    const handleCampaignApprove = async (campaignId) => {
        try {
            const res = await axios.post("http://localhost/dms/api/approveCampaignRequest.php", { campaign_id: campaignId });
            if (res.data.success) setCampaignRequests(prev => prev.filter(r => r.campaign_id !== campaignId));
            else alert(res.data.message);
        } catch (err) {
            alert("Error approving campaign request.");
        }
    };

    const handleCampaignDeny = async (campaignId) => {
        try {
            const res = await axios.post("http://localhost/dms/api/denyCampaignRequest.php", { campaign_id: campaignId });
            if (res.data.success) setCampaignRequests(prev => prev.filter(r => r.campaign_id !== campaignId));
            else alert(res.data.message);
        } catch (err) {
            alert("Error denying campaign request.");
        }
    };
    

    if (loading) return <p>Loading dashboard...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!profile) return <p>No profile data found.</p>;

    const pendingUserRequests = userRequests.filter(req => req.status === "Pending");

    if (profile.role === "Admin") {
        return (
            <div className={myDashboard.container}>
                <h1>Admin Dashboard</h1>
                <p>Welcome, {profile.username}! You can manage user and campaign requests here.</p>

                <h2>User Profile Change Requests</h2>
                {pendingUserRequests.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>User ID</th>
                                <th>Current Username</th>
                                <th>New Username</th>
                                <th>Current Role</th>
                                <th>New Role</th>
                                <th>Status</th>
                                <th>Requested At</th>
                                <th colSpan={2}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingUserRequests.map(req => (
                                <tr key={req.pending_id}>
                                    <td>{req.user_id}</td>
                                    <td>{req.current_username}</td>
                                    <td>{req.new_username}</td>
                                    <td>{req.current_role}</td>
                                    <td>{req.new_role}</td>
                                    <td>{req.status}</td>
                                    <td>{req.requested_at}</td>
                                    <td>
                                        <button className={myDashboard.approveButton} onClick={() => handleUserApprove(req.pending_id, req.new_username, req.new_role, req.user_id)}>Approve</button>
                                    </td>
                                    <td>
                                        <button className={myDashboard.denyButton} onClick={() => handleUserDeny(req.pending_id)}>Deny</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : <p>No user profile change requests pending.</p>}


                <h2>Campaign Creation Requests</h2>
                {campaignRequests.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Campaign Name</th>
                                <th>Description</th>
                                <th>Category</th>
                                <th>Target Quantity</th>
                                <th>Location</th>
                                <th>Status</th>
                                <th colSpan={2}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {campaignRequests.map(req => (
                                <tr key={req.campaign_id}>
                                    <td>{req.campaign_name}</td>
                                    <td>{req.campaign_description}</td>
                                    <td>{req.campaign_category}</td>
                                    <td>{req.target_quantity}</td>
                                    <td>{req.location}</td>
                                    <td>{req.campaign_status}</td>
                                    <td>
                                        <button className={myDashboard.approveButton} onClick={() => handleCampaignApprove(req.campaign_id)}>Approve</button>
                                    </td>
                                    <td>
                                        <button className={myDashboard.denyButton} onClick={() => handleCampaignDeny(req.campaign_id)}>Deny</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : <p>No campaign creation requests pending.</p>}

                <h2>All User Requests Records</h2>
                {userRequests.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>User ID</th>
                                <th>Requested Username</th>
                                <th>Requested Role</th>
                                <th>Status</th>
                                <th>Requested At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userRequests.map(req => (
                                <tr key={req.pending_id}>
                                    <td>{req.user_id}</td>
                                    <td>{req.new_username}</td>
                                    <td>{req.new_role}</td>
                                    <td>{req.status}</td>
                                    <td>{req.requested_at}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : <p>No user request records found.</p>}

                <h2>All Campaign Requests Records</h2>
                {campaignRequests.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Campaign Name</th>
                                <th>Description</th>
                                <th>Category</th>
                                <th>Target Quantity</th>
                                <th>Location</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {campaignRequests.map(req => (
                                <tr key={req.campaign_id}>
                                    <td>{req.campaign_name}</td>
                                    <td>{req.campaign_description}</td>
                                    <td>{req.campaign_category}</td>
                                    <td>{req.target_quantity}</td>
                                    <td>{req.location}</td>
                                    <td>{req.campaign_status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : <p>No campaign request records found.</p>}
            </div>
        );
    }

    if (profile.role === "Donor") {
        return (
            <div className={myDashboard.container}>
                <h1>{profile.username} Dashboard</h1>
                <h2>Pending Requests</h2>
                {requests.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Campaign</th>
                                <th>Item Type</th>
                                <th>Quantity</th>
                                <th>NGO</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map(req => (
                                <tr key={req.donation_id}>
                                    <td>{req.campaign_name}</td>
                                    <td>{req.item_type}</td>
                                    <td>{req.donated_quantity}</td>
                                    <td>@{req.ngo}</td>
                                    <td>Pending</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : <p>No pending requests. If approved, donations appear in your history.</p>}
                <h2>Donation Records</h2>
                {records.length > 0 ? (
                    <>
                        <table>
                            <thead>
                                <tr>
                                    <th>Campaign</th>
                                    <th>Item</th>
                                    <th>Quantity</th>
                                    <th>NGO</th>
                                </tr>
                            </thead>
                            <tbody>
                                {records.slice(0, 3).map(rec => (
                                    <tr key={rec.dh_id}>
                                        <td>{rec.campaign_name}</td>
                                        <td>{rec.item_type}</td>
                                        <td>{rec.item_quantity}</td>
                                        <td>@{rec.ngo}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button onClick={() => navigate("/records")}>View All Records</button>
                    </>
                ) : <p>No records yet.</p>}
            </div>
        );
    }

    if (profile.role === "NGO") {
        return (
            <div className={myDashboard.container}>
                <h1>{profile.username} Dashboard</h1>
                <h2>Pending Requests</h2>
                {requests.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Campaign</th>
                                <th>Item Type</th>
                                <th>Quantity</th>
                                <th>Donor</th>
                                <th colSpan={2}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map(req => (
                                <tr key={req.donation_id}>
                                    <td>{req.campaign_name}</td>
                                    <td>{req.item_type}</td>
                                    <td>{req.donated_quantity}</td>
                                    <td>@{req.donor}</td>
                                    <td><button className={myDashboard.approveButton} onClick={e => handleApprove(req, e)}>Approve</button></td>
                                    <td><button className={myDashboard.denyButton} onClick={() => handleDeny(req)}>Deny</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : <p>No pending requests.</p>}
                <h2>Donation Records</h2>
                {records.length > 0 ? (
                    <>
                        <table>
                            <thead>
                                <tr>
                                    <th>Campaign</th>
                                    <th>Item</th>
                                    <th>Quantity</th>
                                    <th>Donor</th>
                                </tr>
                            </thead>
                            <tbody>
                                {records.slice(0, 3).map(rec => (
                                    <tr key={rec.dh_id}>
                                        <td>{rec.campaign_name}</td>
                                        <td>{rec.item_type}</td>
                                        <td>{rec.item_quantity}</td>
                                        <td>@{rec.donor}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button onClick={() => navigate("/records")}>View All Records</button>
                    </>
                ) : <p>No donation records yet.</p>}
            </div>
        );
    }

    return (
        <div>
            <h1>Complete Your Profile</h1>
            <p>Please fill out your profile to access dashboard features.</p>
        </div>
    );
}
