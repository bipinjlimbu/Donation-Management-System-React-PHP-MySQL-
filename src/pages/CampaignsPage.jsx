import { useState, useEffect } from "react"
import { useAuth } from "../components/AuthContext"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import myCampaigns from "../style/CampaignsPage.module.css"

export default function CampaignsPage() {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost/dms/api/campaigns.php')
            .then(res => {
                if (res.data.success) {
                    setCampaigns(res.data.campaigns);
                } else {
                    setError(res.data.message || 'Failed to load campaigns');
                }
            })
            .catch(err => {
                console.error('Failed to fetch campaigns:', err);
                setError('Failed to connect to the server.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>Loading campaigns...</div>;
    }
    if (error) {
        return <div style={{ color: 'red' }}>{error}</div>;
    }

    return (
        <div className={myCampaigns.campaigns}>
            <h1>Campaigns</h1>
            <ul>
                {campaigns.length > 0 ? (
                    campaigns.map(campaign => (
                        <li key={campaign.campaign_id}>
                            <strong> {campaign.campaign_name} </strong>
                            <p> {campaign.campaign_description} </p>
                            <p> Start Date: {campaign.start_date} </p>
                            <p> End Date: {campaign.end_date} </p>
                            <button onClick={() => navigate(`/campaigns/${campaign.campaign_id}`)}>View Details</button>
                        </li>
                    ))) : (
                    <li>No campaigns found.</li>
                )}
            </ul>
        </div>
    )
}