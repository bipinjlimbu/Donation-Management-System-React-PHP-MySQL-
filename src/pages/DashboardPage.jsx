import { useState, useEffect } from "react"
import { useAuth } from "../components/AuthContext"
import axios from "axios"

export default function DashboardPage() {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [request, setRequest] = useState(null);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        if (user && user.user_email) {
            const email = user.user_email;
            axios.get(`http://localhost/dms/api/profile.php?email=${email}`)
            .then(res => {
                if (res.data.success) {
                    setProfile(res.data.profile);
                } else {
                    setError(res.data.message || "Failed to load user profile");
                }
            })
            .catch(err => {
                console.error("Failed to fetch user profile:", err);
                setError("Failed to connect to the server.");
            });
        }
    }, [user]);

    useEffect(()=>{
        if(user && user.user_email) {
            const email = user.user_email;
        axios.get(`http://localhost/dms/api/donationPending.php?email=${email}`)
            .then(res => {
                if (res.data.success) {
                    setRequest(res.data.donations);
                } else {
                    setError(res.data.message || "No Pending Request");
                }
            })
            .catch(err => {
                console.error("Failed to fetch user profile:", err);
                setError("Failed to connect to the server.");
            });
        }
    },[user]);
    

    return (
        <div>
            {profile?.user_role === "Admin" ? (
                <div>
                    <h1> Admin Dashboard </h1>
                    <p> Welcome, {profile?.user_name}! Here you can manage campaigns and view donation statistics. </p>
                </div>
            ) : profile?.user_role === "Donor" ? (
                <div>
                    <h1> {profile.user_name} Dashboard </h1>
                </div>
            ) : profile?.user_role == "NGO" ? (
                <div>
                    <h1> {profile.user_name} Dashboard </h1>
                    <p> Your Pending Request </p>
                    {request.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Item Type</th>
                                    <th>Quantity</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {request.map(req => (
                                    <tr key={req.donation_id}>
                                        <td>{req.item_type}</td>
                                        <td>{req.donated_quantity}</td>
                                        <td>
                                            <button onClick={() => handleAction(req.donation_id, "approve")}>
                                                Approve
                                            </button>
                                            <button onClick={() => handleAction(req.donation_id, "deny")}>
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
            ):(
                <div>
                    <h1> Edit Your Profile </h1>
                    <p> Please complete your profile to access dashboard features. </p>
                </div>
            )}
        </div>
    )
}