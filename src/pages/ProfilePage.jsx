import { useState, useEffect } from "react";
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";
import myProfile from "../style/ProfilePage.module.css";
import axios from "axios";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    // Updated: fetch by user_id according to userdetails table
    axios.get("http://localhost/dms/api/profile.php", {
      params: { user_id: user.user_id },
    })
      .then((response) => {
        if (response.data.success) {
          setProfile(response.data.profile);
          setError("");
        } else {
          setError(response.data.message || "Failed to fetch profile.");
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Network or server error");
      });
  }, [user]);

  console.log(profile);
  

  const handleLogout = async () => {
    setLoading(true);
    await logout();
    setLoading(false);
    navigate("/");
  };

  if (!user) {
    return <p>Loading user...</p>;
  }

  if (!profile && !error) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className={myProfile.container}>
      <h1>My Profile</h1>

      {error ? (
        <p>{error}</p>
      ) : (
        <>
          <p><strong>Name:</strong> {profile?.username}</p>
          <p><strong>Role:</strong> {profile?.role}</p>
          <p><strong>Email:</strong> {profile?.email}</p>
        </>
      )}
      <div className={myProfile.buttons}>
        <button onClick={() => navigate("/editProfile")}>
          Edit Profile
        </button>
        <button
          onClick={handleLogout}
          disabled={loading}
        >
          {loading ? "Logging out..." : "Logout"}
        </button>
      </div>
    </div>
  );
}
