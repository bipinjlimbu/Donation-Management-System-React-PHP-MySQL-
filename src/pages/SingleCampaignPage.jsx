import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../components/AuthContext";
import mySingleCampaign from "../style/SingleCampaignPage.module.css";

export default function SingleCampaignPage() {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  const isOwner = user?.role === "NGO" && user?.user_id === campaign?.ngo_id;
  const isAdmin = user?.role === "Admin";
  const canManage = isOwner || isAdmin;

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const res = await axios.get(
          `http://localhost/dms/api/singlecampaigns.php?id=${id}`,
          { withCredentials: true }
        );
        if (res.data.success) setCampaign(res.data.campaign);
        else setError(res.data.message);
      } catch (err) {
        console.error(err);
        setError("Failed to connect to server");
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [id]);

  const deleteCampaign = async () => {
    if (!window.confirm("Are you sure you want to delete this campaign?")) return;

    try {
      const res = await axios.post(
        "http://localhost/dms/api/deletecampaign.php",
        { campaign_id: campaign.campaign_id },
        { withCredentials: true }
      );

      if (res.data.success) {
        alert("Campaign deleted successfully");
        navigate("/campaigns");
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
    }
  };

  return (
    <div className={mySingleCampaign.page}>
      {loading ? (
        <p className={mySingleCampaign.center}>Loading campaign...</p>
      ) : error ? (
        <p className={mySingleCampaign.error}>{error}</p>
      ) : !campaign ? (
        <p className={mySingleCampaign.center}>No campaign found.</p>
      ) : (
        <>
          <div className={mySingleCampaign.hero}>
            <h1 className={mySingleCampaign.title}>{campaign.title}</h1>
            <p className={mySingleCampaign.ngoName}><strong>{campaign.ngo_name}</strong></p>
            <span className={`${mySingleCampaign.statusBadge} ${mySingleCampaign[campaign.status.toLowerCase()]}`}>
              {campaign.status}
            </span>
          </div>

          <div className={mySingleCampaign.description}>
            {campaign.description}
          </div>

          <div className={mySingleCampaign.infoGrid}>
            <div><span>Item</span><p>{campaign.item_name}</p></div>
            <div><span>Target</span><p>{campaign.target_quantity} {campaign.unit}</p></div>
            <div><span>Collected</span><p>{campaign.collected_quantity} {campaign.unit}</p></div>
            <div><span>Start Date</span><p>{campaign.start_date}</p></div>
            <div><span>End Date</span><p>{campaign.end_date}</p></div>
          </div>

          <div className={mySingleCampaign.actions}>
            {user?.role === "Donor" && campaign.status === "Active" && (
              <button
                className={mySingleCampaign.primaryBtn}
                onClick={() => navigate(`/donate/${campaign.campaign_id}`)}
              >
                Donate
              </button>
            )}

            {canManage && campaign.status === "Active" && (
              <button
                className={mySingleCampaign.secondaryBtn}
                onClick={() => navigate(`/edit-campaign/${campaign.campaign_id}`)}
              >
                Edit
              </button>
            )}

            {canManage && (
              <button
                className={mySingleCampaign.deleteBtn}
                onClick={deleteCampaign}
              >
                Delete
              </button>
            )}

            <button
              className={mySingleCampaign.backBtn}
              onClick={() => navigate("/campaigns")}
            >
              Back
            </button>
          </div>
        </>
      )}
    </div>
  );
}