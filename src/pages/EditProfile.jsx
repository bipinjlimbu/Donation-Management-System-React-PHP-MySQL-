import { useState, useEffect } from "react";
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";
import myEdit from "../style/EditProfile.module.css";
import axios from "axios";

export default function EditProfile() {
  const [fullname, setFullname] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    axios.get("http://localhost/dms/api/profile.php", {
        params: { email: user.email },
      })
      .then((res) => {
        if (res.data.success) {
          setFullname(res.data.profile.name);
          setRole(res.data.profile.role);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch current profile:", err);
      });
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "fullname") setFullname(value);
    else if (name === "role") setRole(value);
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullname.trim() || !role.trim()) {
      alert("All fields are required!");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put(
        "http://localhost/dms/api/editProfile.php",
        {
          fullname: fullname.trim(),
          role: role.trim(),
          email: user.email,
        }
      );

      if (response.data.success) {
        alert("Profile updated successfully!");
        navigate("/profile");
      } else {
        alert("Failed to update details: " + response.data.message);
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
            <h1> Edit Your Profile </h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="fullname"> Full Name: </label>
                <input type="text" id="fullname" name="fullname" value={fullname} onChange={handleChange} required />
                <br />
                <label htmlFor="role"> Role: </label>
                <select id="role" name="role" value={role} onChange={handleChange} required>
                    <option value="">Select Role</option>
                    <option value="Donor">Donor</option>
                    <option value="NGO">NGO</option>
                    <option value="Admin">Admin</option>
                </select>
                <br />
                <button type="submit"> Submit </button>
            </form>
        </div>
    )
}