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
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost/dms/api/profile.php", {
          withCredentials: true
        });
        if (res.data.success) setProfile(res.data.user);
        else setError(res.data.message || "Failed to load profile");
      } catch (err) {
        console.error(err);
        setError("Network or server error");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    setActionLoading(true);
    await logout();
    setActionLoading(false);
    navigate("/");
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your profile?")) return;
    setActionLoading(true);

    try {
      const res = await axios.post(
        "http://localhost/dms/api/deleteProfile.php",
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        alert("Profile deleted successfully");
        await logout();
        navigate("/");
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={myProfile.container}>
        <p className={myProfile.loading}>Loading profile...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className={myProfile.container}>
        <p className={myProfile.error}>{error || "Profile not found"}</p>
      </div>
    );
  }

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
        <button
          className={myProfile.editBtn}
          onClick={() => navigate("/editProfile")}
          disabled={actionLoading}
        >
          Edit Profile
        </button>
        <button
          className={myProfile.deleteBtn}
          onClick={handleDelete}
          disabled={actionLoading}
        >
          {actionLoading ? "Processing..." : "Delete Profile"}
        </button>
        <button
          className={myProfile.logoutBtn}
          onClick={handleLogout}
          disabled={actionLoading}
        >
          {actionLoading ? "Logging out..." : "Logout"}
        </button>
      </div>
    </div>
  );
}
