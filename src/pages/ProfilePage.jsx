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

  if (loading) return <p className={myProfile.loading}>Loading profile...</p>;
  if (!profile) return <p className={myProfile.error}>Profile not found.</p>;

  return (
    <div className={myProfile.container}>
      <h1 className={myProfile.heading}>My Profile</h1>

      <div className={myProfile.card}>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Role:</strong> {profile.role}</p>
      </div>

      {profile.role === "Donor" && (
        <div className={myProfile.card}>
          <p><strong>Full Name:</strong> {profile.full_name}</p>
          <p><strong>Phone:</strong> {profile.phone}</p>
          <p><strong>Address:</strong> {profile.address}</p>
        </div>
      )}

      {profile.role === "NGO" && (
        <div className={myProfile.card}>
          <p><strong>Organization Name:</strong> {profile.organization_name}</p>
          <p><strong>Registration Number:</strong> {profile.registration_number}</p>
          <p><strong>Phone:</strong> {profile.phone}</p>
          <p><strong>Address:</strong> {profile.address}</p>
        </div>
      )}

      <div className={myProfile.buttons}>
        <button className={myProfile.editBtn} onClick={() => navigate("/editProfile")}>Edit Profile</button>
        <button className={myProfile.logoutBtn} onClick={handleLogout}>
          {loading ? "Logging out..." : "Logout"}
        </button>
      </div>
    </div>
  );
}
