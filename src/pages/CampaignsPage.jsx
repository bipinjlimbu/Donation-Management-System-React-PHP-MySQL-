import { useState, useEffect } from "react";
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import myCampaigns from "../style/CampaignsPage.module.css"; // ✅ your CSS

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return setLoading(false);

    axios.get("http://localhost/dms/api/campaigns.php", {
      withCredentials: true // ✅ send session cookie
    })
      .then(res => {
        if (res.data.success) setCampaigns(res.data.campaigns);
        else setError(res.data.message || "Failed to load campaigns");
      })
      .catch(() => setError("Failed to connect to server"))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <div className={myCampaigns.center}>Loading campaigns...</div>;
  if (error) return <div className={myCampaigns.error}>{error}</div>;

  return (
    <div className={myCampaigns.container}>
      <div className={myCampaigns.header}>
        <h1>Campaigns</h1>

        {user?.role === "NGO" && (
          <button
            className={myCampaigns.createBtn}
            onClick={() => navigate("/createCampaign")}
          >
            + Create Campaign
          </button>
        )}
      </div>

      <div className={myCampaigns.grid}>
        {campaigns.length > 0 ? (
          campaigns.map(c => (
            <div key={c.campaign_id} className={myCampaigns.card}>
              <h3 className={myCampaigns.title}>{c.title}</h3>
              <p className={myCampaigns.description}>
                {c.description?.length > 120 ? c.description.slice(0, 120) + "..." : c.description}
              </p>
              <div className={myCampaigns.meta}>
                <span><strong>Status:</strong> {c.status}</span>
                <span><strong>Start:</strong> {c.start_date}</span>
                <span><strong>End:</strong> {c.end_date}</span>
              </div>
              <button
                className={myCampaigns.viewBtn}
                onClick={() => navigate(`/campaigns/${c.campaign_id}`)}
              >
                View Details
              </button>
            </div>
          ))
        ) : (
          <div className={myCampaigns.center}>No campaigns found.</div>
        )}
      </div>
    </div>
  );
}
