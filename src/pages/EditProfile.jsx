import { useState, useEffect } from "react";
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";
import myEdit from "../style/EditProfile.module.css";
import axios from "axios";

export default function EditProfile() {
  const [profile, setProfile] = useState({
    user_name: "",
    user_role: "",
  });
  const [initialRole, setInitialRole] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    axios.get("http://localhost/dms/api/profile.php", {
      params: { email: user.user_email },
    })
    .then((res) => {
       if (res.data.success) {
        setProfile(res.data.profile);
      }
      if (res.data.profile.user_role === "User") {
        setInitialRole(true);
      }
    })
    .catch((err) => {
      console.error("Failed to fetch current profile:", err);
    });
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name === "fullname" ? "user_name" : "user_role"]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { user_name, user_role } = profile;

    if (!user_name.trim() || !user_role.trim()) {
      alert("All fields are required!");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost/dms/api/profileEditRequest.php", {
        fullname: user_name.trim(),
        role: user_role.trim(),
        email: user.user_email,
      });

      if (response.data.success) {
        alert("Profile Change Requested successfully!");
        navigate("/profile");
      } else {
        alert("Failed to request: " + response.data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Network or server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={myEdit.container}>
      <h1>Edit Your Profile</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="fullname">Full Name:</label>
        <input type="text" id="fullname" name="fullname" value={profile.user_name} onChange={handleChange} required/>
        <br/>
        { initialRole && (
          <>
            <label htmlFor="role">Role:</label>
            <select id="role" name="role" value={profile.user_role} onChange={handleChange} required>
              <option value="">Select Role</option>
              <option value="Donor">Donor</option>
              <option value="NGO">NGO</option>
              <option value="Admin">Admin</option>
            </select>
            <br/>
          </>
        ) }
        <div className={myEdit.buttons}>
          <button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update"}
          </button>
          <button type="button" onClick={() => navigate("/profile")}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
