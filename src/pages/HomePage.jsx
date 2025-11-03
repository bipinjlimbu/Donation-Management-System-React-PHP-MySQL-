import myHome from "../style/HomePage.module.css"
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams();
    const [campaigns, setCampaigns] = useState([]);

    useEffect(() => {
        axios.get('http://localhost/dms/api/campaigns.php')
            .then(res => {
                if (res.data.success) {
                    setCampaigns(res.data.campaigns);
                } else {
                    console.error(res.data.message || 'Failed to load campaigns');
                }
            })
            .catch(err => {
                console.error('Failed to fetch campaigns:', err);
            });
    }, []);

    return (
        <div className={myHome.container}>
            <div className={myHome.home}>
                <h1> Welcome to ShareHope </h1>
                <p> This platform helps NGOs track item donations, monitor campaigns, and maintain transparent donor records all in one place. You can also donate items easily and make a meaningful impact. </p>
                {!user? (
                    <div className={myHome.authButtons}>
                        <button onClick={() => navigate("/login")}> Login </button>
                        <button onClick={() => navigate("/signup")}> Register </button>
                    </div>
                ):(
                    <div className={myHome.authButtons}>
                        <button onClick={() => navigate("/profile")}> View Profile </button>
                    </div>
                )}
            </div>
            <div className={myHome.latestCampaigns}>
                <h2> Latest Campaigns </h2>
                <div className={myHome.campaigns}>
                    {campaigns.slice(0, 3).map(campaign =>(
                        <div key={campaign.campaign_id} className={myHome.campaignCard}>
                            <h3> {campaign.campaign_name} </h3>
                            <p> {campaign.campaign_description} </p>
                            <p> <strong> Status: </strong>{campaign.campaign_status} </p>
                            <button onClick={() => navigate(`/campaigns/${campaign.campaign_id}`)}>View Details</button>
                        </div>
                    ))}
                </div> 
                <button onClick={() => navigate("/campaigns")} className={myHome.moreButton}> View All Campaigns </button> 
            </div>
        </div>
    )
}