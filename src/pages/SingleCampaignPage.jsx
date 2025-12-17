import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import mySingleCampaign from "../style/SingleCampaignPage.module.css";
import { useAuth } from "../components/AuthContext";

export default function SingleCampaignPage() {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost/dms/api/singlecampaigns.php?id=${id}`)
      .then(res => {
        if (res.data.success) setCampaign(res.data.campaign);
        else setError(res.data.message);
      })
      .catch(() => setError("Failed to connect to server"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className={mySingleCampaign.center}>Loading campaign...</p>;
  if (error) return <p className={mySingleCampaign.error}>{error}</p>;
  if (!campaign) return <p className={mySingleCampaign.center}>No campaign found.</p>;

  return (
    <div className={mySingleCampaign.page}>
      <h1 className={mySingleCampaign.title}>{campaign.title}</h1>

      <p className={mySingleCampaign.description}>
        {campaign.description}
      </p>

      <div className={mySingleCampaign.infoGrid}>
        <div><span>Item</span><p>{campaign.item_name}</p></div>
        <div><span>Target</span><p>{campaign.target_quantity} {campaign.unit}</p></div>
        <div><span>Collected</span><p>{campaign.collected_quantity} {campaign.unit}</p></div>
        <div><span>Status</span><p>{campaign.status}</p></div>
        <div><span>NGO</span><p>{campaign.ngo_name}</p></div>
        <div><span>Start Date</span><p>{campaign.start_date}</p></div>
        <div><span>End Date</span><p>{campaign.end_date}</p></div>
      </div>

      <div className={mySingleCampaign.actions}>
        {user?.role === "Donor" && campaign.status === "Active" && (
          <button className={mySingleCampaign.primaryBtn}
            onClick={() => navigate(`/donate/${campaign.campaign_id}`)}>
            Donate
          </button>
        )}

        {user?.role === "NGO" && user?.user_id === campaign.ngo_id && (
          <button className={mySingleCampaign.secondaryBtn}
            onClick={() => navigate(`/edit-campaign/${campaign.campaign_id}`)}>
            Edit Campaign
          </button>
        )}

        <button className={mySingleCampaign.backBtn}
          onClick={() => navigate("/campaigns")}>
          Back
        </button>
      </div>
    </div>
  );
}
