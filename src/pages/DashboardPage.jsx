import { useState, useEffect } from "react";
import { useAuth } from "../components/AuthContext";
import myDashboard from "../style/DashboardPage.module.css";
import axios from "axios";

export default function DashboardPage() {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [request, setRequest] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user && user.user_email) {
            const email = user.user_email;
            axios
                .get(`http://localhost/dms/api/profile.php?email=${email}`)
                .then((res) => {
                    if (res.data.success) {
                        setProfile(res.data.profile);
                    } else {
                        setError(res.data.message || "Failed to load user profile");
                    }
                })
                .catch((err) => {
                    console.error("Failed to fetch user profile:", err);
                    setError("Failed to connect to the server.");
                });
        }
    }, [user]);

    useEffect(() => {
        if (user && user.user_email) {
            const email = user.user_email;
            axios
                .get(`http://localhost/dms/api/donationPending.php?email=${email}`)
                .then((res) => {
                    if (res.data.success) {
                        setRequest(res.data.donations);
                    } else {
                        setError(res.data.message || "No Pending Request");
                    }
                })
                .catch((err) => {
                    console.error("Failed to fetch donation requests:", err);
                    setError("Failed to connect to the server.");
                });
        }
    }, [user]);

    const handleApprove = (req, e) => {
        e.preventDefault();
        axios
            .post("http://localhost/dms/api/donationHistory.php", {
                donation_id: req.donation_id,
                campaign_name: req.campaign_name,
                item_type: req.item_type,
                quantity: req.donated_quantity,
                donor: req.donor,
                ngo: req.ngo,
            })
            .then((res) => {
                if (res.data.success) {
                    alert("Donation Approved!");
                    setRequest((prev) =>
                        prev.filter((r) => r.donation_id !== req.donation_id)
                    );
                } else {
                    alert("Donation failed: " + res.data.message);
                }
            })
            .catch((err) => {
                console.error("Donation error:", err);
                alert("Network or server error during donation.");
            });
    };

    const handleDeny = (req) => {
        if (!window.confirm("Are you sure you want to deny this donation?")) return;

        axios
            .post("http://localhost/dms/api/deletePending.php", {
                donation_id: req.donation_id,
            })
            .then((res) => {
                if (res.data.success) {
                    alert("Donation request denied and removed.");
                    setRequest((prev) =>
                        prev.filter((r) => r.donation_id !== req.donation_id)
                    );
                } else {
                    alert("Failed to deny donation: " + res.data.message);
                }
            })
            .catch((err) => {
                console.error("Deny error:", err);
                alert("Network or server error during denial.");
            });
    };

    return (
        <div>
            {profile?.user_role === "Admin" ? (
                <div>
                    <h1>Admin Dashboard</h1>
                    <p>
                        Welcome, {profile?.user_name}! Here you can manage campaigns and
                        view donation statistics.
                    </p>
                </div>
            ) : profile?.user_role === "Donor" ? (
                <div className={myDashboard.container}>
                    <h1>{profile.user_name} Dashboard</h1>
                    <p> Your Pending Requests </p>

                    {request.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Campaign Name</th>
                                    <th>Item Type</th>
                                    <th>Quantity</th>
                                    <th>NGO</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {request.map((req) => (
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
                            <p>If Your Donation is Approved, It will be added as your history. Else, It is Denied due to some reasons.</p>
                        </>
                    )}
                </div>
            ) : profile?.user_role === "NGO" ? (
                <div className={myDashboard.container}>
                    <h1>{profile.user_name} Dashboard</h1>
                    <p>Your Pending Requests</p>

                    {request.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Campaign Name</th>
                                    <th>Item Type</th>
                                    <th>Quantity</th>
                                    <th>Donor</th>
                                    <th colSpan={2}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {request.map((req) => (
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
                </div>
            ) : (
                <div>
                    <h1>Edit Your Profile</h1>
                    <p>Please complete your profile to access dashboard features.</p>
                </div>
            )}
        </div>
    );
}
