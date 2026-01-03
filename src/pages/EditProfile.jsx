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
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const res = await axios.get("http://localhost/dms/api/profile.php", {
          withCredentials: true,
        });

        if (res.data.success) {
          const data = res.data.user;

          if (data.role === "Donor") {
            setProfile({
              name: data.pending_full_name || data.full_name || "",
              phone: data.pending_phone || data.phone || "",
              address: data.pending_address || data.address || "",
            });
          } else if (data.role === "NGO") {
            setProfile({
              name: data.pending_organization_name || data.organization_name || "",
              phone: data.pending_phone || data.phone || "",
              address: data.pending_address || data.address || "",
            });
          }

          setError(null);
        } else {
          setError(res.data.message || "Failed to load profile");
        }
      } catch (err) {
        console.error(err);
        setError("Network error while fetching profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
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

    setSubmitLoading(true);
    try {
      const res = await axios.post(
        "http://localhost/dms/api/profileEditRequest.php",
        {
          user_id: user.user_id,
          role: user.role,
          ...profile,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        alert("Profile change requested successfully!");
        navigate("/profile");
      } else {
        alert(res.data.message || "Request failed");
      }
    } catch (err) {
      console.error(err);
      alert("Network or server error");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={myEdit.container}>
        <p className={myEdit.loading}>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={myEdit.container}>
        <p className={myEdit.error}>{error}</p>
      </div>
    );
  }

  return (
    <div className={myEdit.container}>
      <h1 className={myEdit.heading}>Edit Your Profile</h1>

      <div className={myEdit.card}>
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">
            {user.role === "Donor" ? "Full Name" : "Organization Name"}:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={profile.name}
            onChange={handleChange}
          />

          <label htmlFor="phone">Phone:</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
          />

          <label htmlFor="address">Address:</label>
          <textarea
            id="address"
            name="address"
            value={profile.address}
            onChange={handleChange}
          />

          <div className={myEdit.buttons}>
            <button type="submit" className={myEdit.submitBtn} disabled={submitLoading}>
              {submitLoading ? "Submitting..." : "Submit"}
            </button>
            <button
              type="button"
              className={myEdit.cancelBtn}
              onClick={() => navigate("/profile")}
              disabled={submitLoading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
