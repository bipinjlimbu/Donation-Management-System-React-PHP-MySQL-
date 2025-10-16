 import { useState, useEffect } from "react";
 import { useParams } from "react-router-dom";
 import axios from "axios";

 export default function SingleCampaignPage() {
    const { id } = useParams();
    const [campaign, setCampaign] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost/dms/api/singlecampaigns.php?id=${id}`)
            .then(res => {
                if (res.data.success) {
                    setCampaign(res.data.campaign);
                } else {
                    setError(res.data.message || 'Failed to load campaign');
                }
            })
            .catch(err => {
                console.error('Failed to fetch campaign:', err);
                setError('Failed to connect to the server.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return <div>Loading campaign...</div>;
    }
    if (error) {
        return <div style={{ color: 'red' }}>{error}</div>;
    }
    if (!campaign) {
        return <div>No campaign found.</div>;
    }
    return (
        <div>
            <h2> {campaign.campaign_name} </h2>
            <p> {campaign.campaign_description} </p>
            <p> Item Type: {campaign.item_type} </p>
            <p> Category: {campaign.category} </p>
            <p> Campaign Status: {campaign.status} </p>
            <p> Target Quantity: {campaign.target_quantity} </p>
            <p> Target Quantity: {campaign.collected_quantity} </p>
            <p> Location: {campaign.location} </p>
            <p> Start Date: {campaign.start_date}</p>
            <p> End Date: {campaign.end_date}</p>
            
        </div>
    );
 }