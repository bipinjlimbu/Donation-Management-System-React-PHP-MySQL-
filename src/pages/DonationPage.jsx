import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import myDonation from "../style/DonationPage.module.css";
import axios from "axios";

export default function DonationPage() {
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
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div>Loading donation page...</div>;
    if (error) return <div style={{ color: "red" }}>{error}</div>;
    if (!campaign) return <div>No campaign found.</div>;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCampaign(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost/dms/api/donationPending.php', {
            campaign_id: campaign.campaign_id,
            item_type: campaign.item_type,
            quantity: campaign.quantity,
            donated_to:campaign.created_by,
            donated_by:user.user_email
        })
        .then(res => {
            if (res.data.success) {
                alert("Donation Requested!");
            } else {
                alert("Donation failed: " + res.data.message);
            }
            navigate("/campaigns")
        })
        .catch(err => {
            console.error("Donation error:", err);
            alert("Network or server error during donation.");
        });
    };

    return (
        <div className={myDonation.donationPage}>
            <h1>Donation Page</h1>
            <h2>Campaign: {campaign.campaign_name}</h2>
            <p>{campaign.campaign_description}</p>
            <div className={myDonation.donationForm}>
                <h2>Donation Form</h2>
                <form onSubmit={handleSubmit}>
                <label>Item: </label>
                <input type="text" name="item" value={campaign.item_type} onChange={handleChange} required />
                <br />
                <label>Quantity: </label>
                <input type="number" name="quantity" onChange={handleChange} required />
                <br />
                <button type="submit">Donate</button>
            </form>
            </div>
        </div>
    );
}