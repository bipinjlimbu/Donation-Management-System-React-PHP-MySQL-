import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";
import myCampaigns from "../style/CampaignsPage.module.css";

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return;

    axios
      .get("http://localhost/dms/api/campaigns.php", {
        withCredentials: true
      })
      .then(res => {
        if (res.data.success) setCampaigns(res.data.campaigns);
        else setError(res.data.message);
      })
      .catch(() => setError("Failed to connect to server"))
      .finally(() => setLoading(false));
  }, [authLoading]);

  const visibleCampaigns = campaigns.filter(c => {
    if (user?.role === "NGO" && c.ngo_id === user.user_id) return true;
    return c.status === "Active" || c.status === "Completed";
  });

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

      {loading ? (
        <div className={myCampaigns.center}>Loading campaigns...</div>
      ) : error ? (
        <div className={myCampaigns.error}>{error}</div>
      ) : (
        <div className={myCampaigns.grid}>
          {visibleCampaigns.length ? (
            visibleCampaigns.map(c => (
              <div key={c.campaign_id} className={myCampaigns.card}>
                <h3 className={myCampaigns.title}>{c.title}</h3>
                <p className={myCampaigns.description}>
                  {c.description?.length > 120
                    ? c.description.slice(0, 120) + "..."
                    : c.description}
                </p>
                <div className={myCampaigns.meta}>
                  <span><strong>Status:</strong> {c.status}</span>
                  <span><strong>Start:</strong> {c.start_date}</span>
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
      )}
    </div>
  );
}
