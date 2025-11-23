import { useState, useEffect } from "react";
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";
import myEdit from "../style/EditProfile.module.css";
import axios from "axios";

export default function EditProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.role === "Donor") {
        setProfile({
          name: user.pending_full_name || user.full_name || "",
          phone: user.pending_phone || user.phone || "",
          address: user.pending_address || user.address || "",
        });
      } else if (user.role === "NGO") {
        setProfile({
          name: user.pending_organization_name || user.organization_name || "",
          phone: user.pending_phone || user.phone || "",
          address: user.pending_address || user.address || "",
        });
      }
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!profile.name.trim()) {
      alert("Name is required!");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost/dms/api/profileEditRequest.php", {
        user_id: user.user_id,
        role: user.role,
        ...profile,
      });

      if (response.data.success) {
        alert("Profile change requested successfully!");
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

  if (!user) return <p>Loading...</p>;

  return (
    <div className={myEdit.container}>
      <h1>Edit Your Profile</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">
          {user.role === "Donor" ? "Full Name" : "Organization Name"}:
        </label>
        <input type="text" id="name" name="name" value={profile.name} onChange={handleChange} />
        <label htmlFor="phone">Phone:</label>
        <input type="text" id="phone" name="phone" value={profile.phone} onChange={handleChange} />
        <label htmlFor="address">Address:</label>
        <textarea id="address" name="address" value={profile.address} onChange={handleChange} />
        <div className={myEdit.buttons}>
          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
          <button type="button" onClick={() => navigate("/profile")}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
