import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import myEditCampaign from "../style/EditCampaign.module.css";
import { useAuth } from "../components/AuthContext";

export default function EditCampaignPage() {
    const { id } = useParams();
    const [campaign, setCampaign] = useState({
        campaign_description: "",
        campaign_status: "",
        start_date: "",
        end_date: ""
    });
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
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCampaign(prev => ({ ...prev, [name]: value }));
    };
    console.log("Editing campaign data:", campaign);
    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put('http://localhost/dms/api/editcampaign.php', {
            campaign_id: id,
            campaign_name: campaign.campaign_name,
            campaign_description: campaign.campaign_description,
            campaign_status: campaign.campaign_status,
            start_date: campaign.start_date,
            end_date: campaign.end_date
        })
        .then(res => {
            if (res.data.success) {
                alert("Campaign updated successfully!");    
                navigate(`/campaigns/${id}`);
            } else {
                alert("Update failed: " + res.data.message);
            }
        })
        .catch(err => {
            console.error("Update error:", err);
            alert("Network or server error during update.");
        });
    };

    if (loading) return <div>Loading edit page...</div>;
    if (error) return <div style={{ color: "red" }}>{error}</div>;

    return (
        <div className={myEditCampaign.editCampaign}>
            <h1>Edit Campaign</h1>
            <div className={myEditCampaign.formContainer}>
                <form onSubmit={handleSubmit}>
                    <label>Campaign Name:</label>
                    <input type="text" name="campaign_name" value={campaign.campaign_name} onChange={handleChange} required />
                    <br/>
                    <label>Campaign Description:</label>
                    <textarea name="campaign_description" value={campaign.campaign_description} onChange={handleChange} required />
                    <br/>
                    <label>Campaign Status:</label>
                    <select name="campaign_status" value={campaign.campaign_status} onChange={handleChange} required>
                        <option value="">Select Status</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                    </select>
                    <br/>
                    <label>Start Date:</label>
                    <input type="date" name="start_date" value={campaign.start_date} onChange={handleChange} required />
                    <br/>
                    <label>End Date:</label>
                    <input type="date" name="end_date" value={campaign.end_date} onChange={handleChange} required />
                    <br/>
                    <button type="submit">Update Campaign</button>
                </form>
            </div>
        </div>
    )
}