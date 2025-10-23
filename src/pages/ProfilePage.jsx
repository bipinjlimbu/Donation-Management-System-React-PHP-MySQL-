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
    axios.get("http://localhost/dms/api/profile.php", {params: { email: user.user_email },})
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
          <p> <strong> Name: </strong> {profile?.user_name}</p>
          <p> <strong> Role: </strong> {profile?.user_role}</p>
          <p> <strong> Email: </strong> {user.user_email}</p>
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