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
                if (res.data.success) {
                    setCampaign(res.data.campaign);
                } else {
                    setError(res.data.message || "Failed to load campaign");
                }
            })
            .catch(err => {
                console.error("Failed to fetch campaign:", err);
                setError("Failed to connect to the server.");
            })
            .finally(() => setLoading(false));
    }, [id]);

    const handleDonate = () => {
        navigate(`/donate/${campaign.campaign_id}`);
    };

    const handleEdit = () => {
        navigate(`/edit-campaign/${campaign.campaign_id}`);
    };

    const handleBack = () => {
        navigate("/campaigns");
    };

    if (loading) return <div>Loading campaign...</div>;
    if (error) return <div style={{ color: "red" }}>{error}</div>;
    if (!campaign) return <div>No campaign found.</div>;

    return (
        <div className={mySingleCampaign.campaign}>
            <h1>{campaign.title}</h1>
            <p>{campaign.description}</p>
            <p className={mySingleCampaign.type}>Item Type: {campaign.item_type}</p>
            <p>Category: {campaign.category}</p>
            <p className={mySingleCampaign.status}>Campaign Status: {campaign.status}</p>
            <p>Target Quantity: {campaign.target_quantity}</p>
            <p>Collected Quantity: {campaign.collected_quantity}</p>
            <p>Location: {campaign.location}</p>
            <p>Created by: {campaign.ngo_name}</p>
            <p className={mySingleCampaign.start}>Start Date: {campaign.start_date}</p>
            <p className={mySingleCampaign.end}>End Date: {campaign.end_date}</p>

            <div className={mySingleCampaign.buttonContainer}>
                {user?.role === "Donor" && campaign.status === "Active" && (
                    <button className={mySingleCampaign.donateButton} onClick={handleDonate}>
                        Donate
                    </button>
                )}
                {user?.role === "NGO" && user?.user_id === campaign.ngo_id && (
                    <button className={mySingleCampaign.editButton} onClick={handleEdit}>
                        Edit Campaign
                    </button>
                )}
                <button className={mySingleCampaign.backButton} onClick={handleBack}>
                    Back
                </button>
            </div>
        </div>
    );
}
