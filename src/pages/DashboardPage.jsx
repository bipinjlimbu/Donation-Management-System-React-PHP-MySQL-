import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import myDashboard from "../style/DashboardPage.module.css";
import axios from "axios";

export default function DashboardPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [signupRequests, setSignupRequests] = useState([]);
    const [donationRequests, setDonationRequests] = useState([]);
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
                const [signReqRes ,donationReqRes, historyRes, userReqRes, campaignReqRes] = await Promise.all([
                    axios.get("http://localhost/dms/api/fetchSignupRequests.php"),
                    axios.get(`http://localhost/dms/api/fetchDonationRequests.php?user_id=${user.user_id}`),
                    axios.get(`http://localhost/dms/api/fetchDonationHistory.php?user_id=${user.user_id}`),
                    axios.get("http://localhost/dms/api/fetchUserRequests.php"),
                    axios.get("http://localhost/dms/api/fetchCampaignRequests.php")
                ]);
                if (signReqRes.data.success) setSignupRequests(signReqRes.data.requests || []);
                if (donationReqRes.data.success) setDonationRequests(donationReqRes.data.donations);
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

    const handleSignupApprove = async (register_id) => {
        try {
            const res = await axios.post("http://localhost/dms/api/approveSignup.php", { register_id });
            if (res.data.success) setSignupRequests(prev => prev.filter(r => r.register_id !== register_id));
            else alert(res.data.message);
        } catch {
            alert("Error approving signup request");
        }
    };

    const handleSignupDeny = async (register_id) => {
        if (!window.confirm("Are you sure you want to deny this signup request?")) return;
        try {
            const res = await axios.post("http://localhost/dms/api/denySignup.php", { register_id });
            if (res.data.success) setSignupRequests(prev => prev.filter(r => r.register_id !== register_id));
            else alert(res.data.message);
        } catch {
            alert("Error denying signup request");
        }
    };

    const handleDonationApprove = async (req, e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost/dms/api/approveDonationRequest.php", {
                donation_id: req.donation_id,
                campaign_id: req.campaign_id,
                quantity: req.quantity
            });
            if (res.data.success)
                setDonationRequests(prev => prev.filter(r => r.donation_id !== req.donation_id));
            else alert(res.data.message);
        } catch {
            alert("Network or server error during approval.");
        }
    };

    const handleDonationDeny = async (req) => {
        if (!window.confirm("Are you sure you want to deny this donation?")) return;
        try {
            const res = await axios.post("http://localhost/dms/api/denyDonationRequest.php", {
                donation_id: req.donation_id
            });
            if (res.data.success)
                setDonationRequests(prev => prev.filter(r => r.donation_id !== req.donation_id));
            else alert(res.data.message);
        } catch {
            alert("Network or server error during denial.");
        }
    };

    const handleUserApprove = async (user_id, role) => {
        try {
            const res = await axios.post("http://localhost/dms/api/approveUserRequest.php", { user_id, role });
            if (res.data.success) setUserRequests(prev => prev.filter(r => r.user_id !== user_id));
            else alert(res.data.message);
        } catch {
            alert("Error approving user request.");
        }
    };

    const handleUserDeny = async (user_id, role) => {
        if (!window.confirm("Are you sure you want to deny this user request?")) return;
        try {
            const res = await axios.post("http://localhost/dms/api/denyUserRequest.php", { user_id, role });
            if (res.data.success) setUserRequests(prev => prev.filter(r => r.user_id !== user_id));
            else alert(res.data.message);
        } catch {
            alert("Error denying user request.");
        }
    };

    const handleCampaignApprove = async (campaign_id) => {
        try {
            const res = await axios.post("http://localhost/dms/api/approveCampaignRequest.php", { campaign_id });
            if (res.data.success) 
                setCampaignRequests(prev => prev.filter(r => r.campaign_id !== campaign_id));
            else alert(res.data.message);
        } catch {
            alert("Network or server error during campaign approval.");
        }
    };

    const handleCampaignDeny = async (campaign_id) => {
        if (!window.confirm("Are you sure you want to deny this campaign request?")) return;
        try {
            const res = await axios.post("http://localhost/dms/api/denyCampaignRequest.php", { campaign_id });
            if (res.data.success) 
                setCampaignRequests(prev => prev.filter(r => r.campaign_id !== campaign_id));
            else alert(res.data.message);
        } catch {
            alert("Error denying campaign request.");
        }
    };

    const handleDelete = async (id, type) => {
        if (!window.confirm("Are you sure you want to delete this record?")) return;
        try {
            const res = await axios.post("http://localhost/dms/api/deleteRecord.php", { id, type });
            if (res.data.success) {
                if (type === "user") setUserRequests(prev => prev.filter(r => r.pending_id !== id));
                else if (type === "donation") setDonationRequests(prev => prev.filter(r => r.pending_id !== id));
                else if (type === "campaign") setCampaignRequests(prev => prev.filter(r => r.pending_id !== id));
            } else alert(res.data.message);
        } catch {
            alert("Error deleting record.");
        }
    };

    if (loading) return <p>Loading dashboard...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!user) return <p>No profile data found.</p>;

    const pendingDonationRequests = donationRequests.filter(req => req.status === "Pending");
    const recordDonationRequests = donationRequests.filter(req => req.status !== "Pending");

    if (user.role === "Admin") {
        return (
            <div className={myDashboard.container}>
                <h1>Admin Dashboard</h1>
                <p>Welcome, {user.username}! You can manage user and campaign requests here.</p>
                <h2>New Signup Requests</h2>
                {signupRequests.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Registration Number</th>
                                <th>Requested At</th>
                                <th colSpan={2}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {signupRequests.map(req => (
                                <tr key={req.register_id}>
                                    <td>{req.email}</td>
                                    <td>{req.role}</td>
                                    <td>{req.role === "NGO" ? req.registration_number : "-"}</td>
                                    <td>{req.requested_at}</td>
                                    <td>
                                        <button className={myDashboard.approveButton} onClick={() => handleSignupApprove(req.register_id)}>Approve</button>
                                    </td>
                                    <td>
                                        <button className={myDashboard.denyButton} onClick={() => handleSignupDeny(req.register_id)}>Deny</button>
                                    </td>
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
                        <th colSpan={2}>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {userRequests.map((req) => (
                        <tr key={req.user_id}>
                        <td>{req.user_id}</td>
                        <td>{req.role}</td>
                        <td>{req.current_name || "-"}</td>
                        <td>{req.new_name || "-"}</td>
                        <td>{req.current_phone || "-"}</td>
                        <td>{req.new_phone || "-"}</td>
                        <td>{req.current_address || "-"}</td>
                        <td>{req.new_address || "-"}</td>
                        <td>{req.status}</td>
                        <td>{req.requested_at}</td>
                        <td>
                            <button className={myDashboard.approveButton} onClick={() => handleUserApprove(req.user_id, req.role)}>
                            Approve
                            </button>
                        </td>
                        <td>
                            <button className={myDashboard.denyButton} onClick={() => handleUserDeny(req.user_id, req.role)}>
                            Deny
                            </button>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                ) : (
                <p>No user profile change requests pending.</p>
                )}

                <h2>Campaign Creation Requests</h2>
                {campaignRequests.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Target Quantity</th>
                                <th>Status</th>
                                <th>Requested By</th>
                                <th>Requested At</th>
                                <th colSpan={2}>Actions</th>
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

                <h2>Donation History</h2>
                {records.length > 0 ? (
                    <>
                        <table>
                            <thead>
                                <tr>
                                    <th>Campaign</th>
                                    <th>Category</th>
                                    <th>Item Type</th>
                                    <th>Quantity</th>
                                    <th>Donor</th>
                                    <th>NGO</th>
                                    <th>Location</th>
                                    <th>Donated At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {records.slice(0, 3).map(rec => (
                                    <tr key={rec.donation_id}>
                                        <td>{rec.campaign_title}</td>
                                        <td>{rec.category}</td>
                                        <td>{rec.item_type}</td>
                                        <td>{rec.quantity}</td>
                                        <td>{rec.donor_name}</td>
                                        <td>{rec.ngo_name}</td>
                                        <td>{rec.location}</td>
                                        <td>{rec.donated_at}</td>
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

    if (user.role === "Donor") {
        return (
            <div className={myDashboard.container}>
                <h1>{user.username} Dashboard</h1>
                <h2>Donation History</h2>
                {records.length > 0 ? (
                    <>
                        <table>
                            <thead>
                                <tr>
                                    <th>Campaign</th>
                                    <th>Category</th>
                                    <th>Item Type</th>
                                    <th>Quantity</th>
                                    <th>NGO</th>
                                    <th>Location</th>
                                    <th>Donated At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {records.slice(0, 3).map(rec => (
                                    <tr key={rec.donation_id}>
                                        <td>{rec.campaign_title}</td>
                                        <td>{rec.category}</td>
                                        <td>{rec.item_type}</td>
                                        <td>{rec.quantity}</td>
                                        <td>{rec.ngo_name}</td>
                                        <td>{rec.location}</td>
                                        <td>{rec.donated_at}</td>
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

    if (user.role === "NGO") {
        return (
            <div className={myDashboard.container}>
                <h1>{user.username} Dashboard</h1>

                <h2>Pending Donation Approvals</h2>
                {pendingDonationRequests.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Campaign</th>
                                <th>Quantity</th>
                                <th>Donor</th>
                                <th colSpan={2}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingDonationRequests.map(req => (
                                <tr key={req.pending_id}>
                                    <td>{req.campaign_title}</td>
                                    <td>{req.quantity}</td>
                                    <td>{req.donor}</td>
                                    <td>
                                        <button className={myDashboard.approveButton} onClick={e => handleDonationApprove(req, e)}>Approve</button>
                                    </td>
                                    <td>
                                        <button className={myDashboard.denyButton} onClick={() => handleDonationDeny(req)}>Deny</button>
                                    </td>
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
                                    <th>Category</th>
                                    <th>Item Type</th>
                                    <th>Quantity</th>
                                    <th>Donor</th>
                                    <th>Location</th>
                                    <th>Donated At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {records.slice(0, 3).map(rec => (
                                    <tr key={rec.donation_id}>
                                        <td>{rec.campaign_title}</td>
                                        <td>{rec.category}</td>
                                        <td>{rec.item_type}</td>
                                        <td>{rec.quantity}</td>
                                        <td>{rec.donor_name}</td>
                                        <td>{rec.location}</td>
                                        <td>{rec.donated_at}</td>
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
