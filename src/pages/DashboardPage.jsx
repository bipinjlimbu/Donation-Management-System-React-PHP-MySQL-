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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!user?.user_email) return;

        const fetchData = async () => {
            setLoading(true);
            setError("");

            try {
                const email = user.user_email;

                const [profileRes, pendingRes, historyRes] = await Promise.all([
                    axios.get(`http://localhost/dms/api/profile.php?email=${email}`),
                    axios.get(`http://localhost/dms/api/donationPending.php?email=${email}`),
                    axios.get(`http://localhost/dms/api/fetchHistory.php?email=${email}`)
                ]);

                if (profileRes.data.success) {
                    setProfile(profileRes.data.profile);
                } else {
                    setError(profileRes.data.message || "Failed to load profile");
                }

                if (pendingRes.data.success) {
                    setRequests(pendingRes.data.donations);
                }

                if (historyRes.data.success) {
                    setRecords(historyRes.data.donations);
                }
            } catch (err) {
                console.error("Dashboard fetch error:", err);
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

            if (res.data.success) {
                alert("Donation Approved!");
                setRequests((prev) => prev.filter((r) => r.donation_id !== req.donation_id));
            } else {
                alert("Approval failed: " + res.data.message);
            }
        } catch (err) {
            console.error("Approve error:", err);
            alert("Network or server error during donation.");
        }
    };

    const handleDeny = async (req) => {
        if (!window.confirm("Are you sure you want to deny this donation?")) return;
        try {
        const res = await axios.post("http://localhost/dms/api/deletePending.php", {
            donation_id: req.donation_id,
        });
        if (res.data.success) {
            alert("Donation request denied and removed.");
            setRequests((prev) => prev.filter((r) => r.donation_id !== req.donation_id));
        } else {
            alert("Failed to deny donation: " + res.data.message);
        }
    } catch (err) {
        console.error("Deny error:", err);
        alert("Network or server error during denial.");
    }
    };

    if (loading) return <p>Loading dashboard...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    if (!profile) return <p>No profile data found.</p>;

    if (profile.user_role === "Admin") {
        return (
            <div>
                <h1>Admin Dashboard</h1>
                <p>Welcome, {profile.user_name}! You can manage campaigns and view statistics here.</p>
            </div>
        );
    }

    if (profile.user_role === "Donor") {
        return (
            <div className={myDashboard.container}>
                <h1>{profile.user_name} Dashboard</h1>
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
                        {requests.map((req) => (
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
                ) : (
                <>
                    <p>No pending requests.</p>
                    <p>If approved, donations appear in your history.</p>
                </>
                )}

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
                                {records.slice(0, 3).map((rec) => (
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
                ) : (
                    <p>No records yet.</p>
                )}
            </div>
        );
    }

    if (profile.user_role === "NGO") {
        return (
            <div className={myDashboard.container}>
                <h1>{profile.user_name} Dashboard</h1>
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
                            {requests.map((req) => (
                                <tr key={req.donation_id}>
                                    <td>{req.campaign_name}</td>
                                    <td>{req.item_type}</td>
                                    <td>{req.donated_quantity}</td>
                                    <td>@{req.donor}</td>
                                    <td>
                                        <button className={myDashboard.approveButton} onClick={(e) => handleApprove(req, e)}>
                                            Approve
                                        </button>
                                    </td>
                                    <td>
                                        <button className={myDashboard.denyButton} onClick={() => handleDeny(req)}>
                                            Deny
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No pending requests.</p>
                )}

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
                                {records.slice(0, 3).map((rec) => (
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
                ) : (
                    <p>No donation records yet.</p>
                )}
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
