import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../components/AuthContext";
import myCampaign from "../style/CreateCampaignPage.module.css";

export default function CreateCampaignPage() {
  const [campaign, setCampaign] = useState({
    campaign_name: "",
    campaign_description: "",
    item_type: "",
    campaign_category: "",
    targeted_quantity: "",
    location: "",
    start_date:"",
    end_date: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCampaign((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post("http://localhost/dms/api/createcampaign.php", {
        ...campaign,
        user_id: user?.user_id, 
      });

      if (res.data.success) {
        alert("Campaign created successfully!");
        navigate("/campaigns");
      } else {
        setError(res.data.message || "Failed to create campaign.");
      }
    } catch (err) {
      console.error("Create campaign error:", err);
      setError("Network or server error during campaign creation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={myCampaign.container}>
      <h1>Create Campaign</h1>

      {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}

      {loading ? (
        <div>Submitting campaign...</div>
      ) : (
        <div className={myCampaign.formContainer}>
          <form onSubmit={handleSubmit}>
            <label>Campaign Name:</label>
            <input type="text" name="campaign_name" value={campaign.campaign_name} onChange={handleChange} required />
            <label>Campaign Description:</label>
            <textarea name="campaign_description" value={campaign.campaign_description} onChange={handleChange} required />
            <label>Item Type:</label>
            <input type="text" name="item_type" value={campaign.item_type} onChange={handleChange} required />
            <label>Campaign Category:</label>
            <input type="text" name="campaign_category" value={campaign.campaign_category} onChange={handleChange} required />
            <label>Targeted Quantity:</label>
            <input type="number" name="targeted_quantity" value={campaign.targeted_quantity} onChange={handleChange} required />
            <label>Location:</label>
            <input type="text" name="location" value={campaign.location} onChange={handleChange} required />
            <label>Start Date:</label>
            <input type="date" name="start_date" value={campaign.start_date} onChange={handleChange} required />
            <label>End Date:</label>
            <input type="date" name="end_date" value={campaign.end_date} onChange={handleChange} required />
            <button type="submit" disabled={loading}>{loading ? "Creating..." : "Create"}</button>
          </form>
        </div>
      )}
    </div>
  );
}
