import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../components/AuthContext";
import myCampaign from "../style/CreateCampaignPage.module.css";

export default function CreateCampaignPage() {
  const [campaign, setCampaign] = useState({
    title: "",
    description: "",
    item_name: "",
    unit: "",
    target_quantity: "",
    start_date: "",
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
        ngo_id: user?.user_id,
      });

      if (res.data.success) {
        alert(res.data.message);
        navigate("/campaigns");
      } else {
        setError(res.data.message || "Failed to submit campaign request.");
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
      <h1 className={myCampaign.heading}>Create Campaign</h1>

      {error && <div className={myCampaign.error}>{error}</div>}

      <div className={myCampaign.formContainer}>
        <form onSubmit={handleSubmit} className={myCampaign.form}>

          <div className={myCampaign.field}>
            <label>Title</label>
            <input type="text" name="title" value={campaign.title} onChange={handleChange} required />
          </div>

          <div className={`${myCampaign.field} ${myCampaign.fullRow}`}>
            <label>Description</label>
            <textarea name="description" value={campaign.description} onChange={handleChange} required />
          </div>

          <div className={myCampaign.grid}>
            <div className={myCampaign.field}>
              <label>Item Name</label>
              <input type="text" name="item_name" value={campaign.item_name} onChange={handleChange} required />
            </div>

            <div className={myCampaign.field}>
              <label>Unit</label>
              <input type="text" name="unit" value={campaign.unit} onChange={handleChange} required />
            </div>

            <div className={`${myCampaign.field} ${myCampaign.fullRow}`}>
              <label>Target Quantity</label>
              <input
                type="number"
                name="target_quantity"
                value={campaign.target_quantity}
                onChange={handleChange}
                required
              />
            </div>

            <div className={myCampaign.field}>
              <label>Start Date</label>
              <input type="date" name="start_date" value={campaign.start_date} onChange={handleChange} required />
            </div>

            <div className={myCampaign.field}>
              <label>End Date</label>
              <input type="date" name="end_date" value={campaign.end_date} onChange={handleChange} required />
            </div>
          </div>

          <button type="submit" disabled={loading} className={myCampaign.submitBtn}>
            {loading ? "Submitting..." : "Submit Campaign"}
          </button>
        </form>
      </div>
    </div>
  );
}
