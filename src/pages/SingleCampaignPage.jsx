 import { useState, useEffect } from "react";
 import { useParams } from "react-router-dom";
 import axios from "axios";
 import mySingleCampaign from "../style/SingleCampaignPage.module.css"
 import { useAuth } from "../components/AuthContext";

 export default function SingleCampaignPage() {
    const { id } = useParams();
    const [campaign, setCampaign] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

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
        <div className={mySingleCampaign.campaign}>
            <h1> {campaign.campaign_name} </h1>
            <p> {campaign.campaign_description} </p>
            <p className={mySingleCampaign.type}> Item Type: {campaign.item_type} </p>
            <p> Category: {campaign.category} </p>
            <p className={mySingleCampaign.status}> Campaign Status: {campaign.status} </p>
            <p> Target Quantity: {campaign.target_quantity} </p>
            <p> Collected Quantity: {campaign.collected_quantity} </p>
            <p> Location: {campaign.location} </p>
            <p className={mySingleCampaign.start}> Start Date: {campaign.start_date}</p>
            <p className={mySingleCampaign.end}> End Date: {campaign.end_date}</p>
        </div>
    );
 }