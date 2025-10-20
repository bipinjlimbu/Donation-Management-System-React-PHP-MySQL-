import { useState, useEffect } from "react"
import { useAuth } from "../components/AuthContext"
import axios from "axios"

export default function DashboardPage() {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        if (user && user.email) {
            axios
                .get(`http://localhost/dms/api/profile.php?email=${user.email}`)
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
    console.log("PROFILE DATA:", profile);


    return (
        <div>
            {profile?.role === "Admin" ? (
                <div>
                    <h1> Admin Dashboard </h1>
                    <p> Welcome, {profile?.name}! Here you can manage campaigns and view donation statistics. </p>
                </div>
            ) : profile?.role === "Donor" ? (
                <div>
                    <h1> Donor Dashboard </h1>
                    <p> Welcome, {profile?.name}! Here you can view your donation history and manage your profile. </p>
                </div>
            ) : profile?.role == "NGO" ? (
                <div>
                    <h1>Donation Request</h1>
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