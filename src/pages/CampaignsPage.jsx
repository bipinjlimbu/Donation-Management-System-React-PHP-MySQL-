import { useState, useEffect } from "react";
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import myCampaigns from "../style/CampaignsPage.module.css";

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost/dms/api/campaigns.php", {
      params: {
        role: user?.role,
        user_id: user?.user_id,
      }
    })
      .then((res) => {
        if (res.data.success) {
          setCampaigns(res.data.campaigns);
        } else {
          setError(res.data.message || "Failed to load campaigns.");
        }
      })
      .catch(() => {
        setError("Failed to connect to the server.");
      })
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
          campaigns.map((campaign) => (
            <div key={campaign.campaign_id} className={myCampaigns.card}>
              <h3 className={myCampaigns.title}>{campaign.title}</h3>

              <p className={myCampaigns.description}>
                {campaign.description?.length > 120
                  ? campaign.description.slice(0, 120) + "..."
                  : campaign.description}
              </p>

              <div className={myCampaigns.meta}>
                <span><strong>Status:</strong> {campaign.status}</span>
                <span><strong>Start:</strong> {campaign.start_date}</span>
                <span><strong>End:</strong> {campaign.end_date}</span>
              </div>

              <button
                className={myCampaigns.viewBtn}
                onClick={() => navigate(`/campaigns/${campaign.campaign_id}`)}
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
