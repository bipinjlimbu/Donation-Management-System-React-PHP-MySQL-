import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import myEditCampaign from "../style/EditCampaign.module.css";

export default function EditCampaignPage() {
  const { id } = useParams();
  const [campaign, setCampaign] = useState({
    title: "",
    description: "",
    target_quantity: "",
    start_date: "",
    end_date: "",
    status: ""
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost/dms/api/singlecampaigns.php?id=${id}`)
      .then((res) => {
        if (res.data.success) {
          setCampaign(res.data.campaign);
        } else {
          setError(res.data.message || "Failed to load campaign");
        }
      })
      .catch(() => setError("Failed to connect to the server."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCampaign((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .put("http://localhost/dms/api/editcampaign.php", {
        campaign_id: id,
        title: campaign.title,
        description: campaign.description,
        target_quantity: campaign.target_quantity,
        end_date: campaign.end_date,
        status: campaign.status
      })
      .then((res) => {
        if (res.data.success) {
          alert("Campaign updated successfully!");
          navigate(`/campaigns/${id}`);
        } else {
          alert("Update failed: " + res.data.message);
        }
      })
      .catch(() => alert("Network or server error during update."));
  };

  if (loading) return <p className={myEditCampaign.center}>Loading edit page...</p>;
  if (error) return <p className={myEditCampaign.error}>{error}</p>;

  return (
    <div className={myEditCampaign.page}>
      <h1 className={myEditCampaign.title}>Edit Campaign</h1>

      <form className={myEditCampaign.form} onSubmit={handleSubmit}>
        <div className={myEditCampaign.field}>
          <label>Campaign Title</label>
          <input type="text" name="title" value={campaign.title} onChange={handleChange} required />
        </div>

        <div className={myEditCampaign.field}>
          <label>Campaign Description</label>
          <textarea name="description" value={campaign.description} onChange={handleChange} required />
        </div>

        <div className={myEditCampaign.row}>
          <div className={myEditCampaign.field}>
            <label>Target Quantity</label>
            <input type="number" name="target_quantity" value={campaign.target_quantity} onChange={handleChange} required />
          </div>

          <div className={myEditCampaign.field}>
            <label>Status</label>
            <select name="status" value={campaign.status} onChange={handleChange} required>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        <div className={myEditCampaign.field}>
          <label>End Date</label>
          <input type="date" name="end_date" value={campaign.end_date} onChange={handleChange} required />
        </div>

        <div className={myEditCampaign.actions}>
          <button type="submit" className={myEditCampaign.primaryBtn}>
            Update Campaign
          </button>

          <button
            type="button"
            className={myEditCampaign.secondaryBtn}
            onClick={() => navigate(`/campaigns/${id}`)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
