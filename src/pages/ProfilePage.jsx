import { useState, useEffect } from "react";
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";
import myProfile from "../style/ProfilePage.module.css";
import axios from "axios";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.user_id) {
      axios
        .get(`http://localhost/dms/api/profile.php?user_id=${user.user_id}`)
        .then(res => {
          if (res.data.success) {
            setProfile(res.data.user);
          }
        })
        .catch(err => {
          console.error("Failed to fetch profile:", err);
        })
        .finally(() => setLoading(false));
    }
  }, [user]);

  const handleLogout = async () => {
    setLoading(true);
    await logout();
    setLoading(false);
    navigate("/");
  };

  if (loading) return <p>Loading profile...</p>;
  if (!profile) return <p>Profile not found.</p>;

  return (
    <div className={myProfile.container}>
      <h1>My Profile</h1>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Role:</strong> {profile.role}</p>

      {profile.role === "Donor" && (
        <>
          <p><strong>Full Name:</strong> {profile.full_name}</p>
          <p><strong>Phone:</strong> {profile.phone}</p>
          <p><strong>Address:</strong> {profile.address}</p>
        </>
      )}

      {profile.role === "NGO" && (
        <>
          <p><strong>Organization Name:</strong> {profile.organization_name}</p>
          <p><strong>Registration Number:</strong> {profile.registration_number}</p>
          <p><strong>Phone:</strong> {profile.phone}</p>
          <p><strong>Address:</strong> {profile.address}</p>
        </>
      )}

      <div className={myProfile.buttons}>
        <button onClick={() => navigate("/editProfile")}>Edit Profile</button>
        <button onClick={handleLogout}>{loading ? "Logging out..." : "Logout"}</button>
      </div>
    </div>
  );
}
