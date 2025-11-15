import { useState } from "react";
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";
import myProfile from "../style/ProfilePage.module.css";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await logout();
    setLoading(false);
    navigate("/");
  };

  if (!user) {
    return <p>Loading user...</p>;
  }

  return (
    <div className={myProfile.container}>
      <h1>My Profile</h1>

      <p><strong>Name:</strong> {user.username}</p>
      <p><strong>Role:</strong> {user.role}</p>
      <p><strong>Email:</strong> {user.email}</p>

      <div className={myProfile.buttons}>
        <button onClick={() => navigate("/editProfile")}>
          Edit Profile
        </button>
        <button onClick={handleLogout} disabled={loading}>
          {loading ? "Logging out..." : "Logout"}
        </button>
      </div>
    </div>
  );
}
