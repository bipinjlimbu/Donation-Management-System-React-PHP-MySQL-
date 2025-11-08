import { useState, useEffect } from "react";
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import myCampaigns from "../style/CampaignsPage.module.css";

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.user_id) return;

    axios
      .get(`http://localhost/dms/api/profile.php?user_id=${user.user_id}`)
      .then((res) => {
        if (res.data.success) {
          setProfile(res.data.profile);
        } else {
          console.error("Profile not found:", res.data.message);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch profile:", err);
      });
  }, [user]);

  useEffect(() => {
    axios
      .get("http://localhost/dms/api/campaigns.php")
      .then((res) => {
        if (res.data.success) {
          setCampaigns(res.data.campaigns);
        } else {
          setError(res.data.message || "Failed to load campaigns.");
        }
      })
      .catch((err) => {
        console.error("Error fetching campaigns:", err);
        setError("Failed to connect to the server.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading campaigns...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div className={myCampaigns.campaigns}>
      <h1>Campaigns</h1>

      {profile?.role === "NGO" && (
        <button onClick={() => navigate("/createCampaign")}>
          Create Campaign
        </button>
      )}

      <ul>
        {campaigns.length > 0 ? (
          campaigns.map((campaign) => (
            <li key={campaign.c_id}>
              <strong className={myCampaigns.head}>{campaign.title}</strong>
              <p>{campaign.description}</p>
              <strong>Status: {campaign.status}</strong>
              <p>Start Date: {campaign.start_date}</p>
              <p>End Date: {campaign.end_date}</p>
              <button onClick={() => navigate(`/campaigns/${campaign.c_id}`)}>
                View Details
              </button>
            </li>
          ))
        ) : (
          <li>No campaigns found.</li>
        )}
      </ul>
    </div>
  );
}
