import { useState, useEffect } from "react";
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    axios.get("http://localhost/dms/api/profile.php", {params: { email: user.email },})
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
    <div>
      <h1>My Profile</h1>

      {error ? (
        <p>{error}</p>
      ) : (
        <>
          <p> Name: {profile?.name}</p>
          <p> Role: {profile?.role}</p>
          <p> Email: {user.email}</p>
        </>
      )}

      <button
        onClick={handleLogout}
        disabled={loading}
      >
        {loading ? "Logging out..." : "Logout"}
      </button>
    </div>
  );
}