import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import myDonation from "../style/DonationPage.module.css";
import axios from "axios";

export default function DonationPage() {
    const { id } = useParams();
    const [campaign, setCampaign] = useState(null);
    const [quantity, setQuantity] = useState("");
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

    if (loading) return <div>Loading donation page...</div>;
    if (error) return <div style={{ color: "red" }}>{error}</div>;
    if (!campaign) return <div>No campaign found.</div>;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!quantity || quantity <= 0) {
            alert("Please enter a valid quantity to donate.");
            return;
        }

        try {
            const res = await axios.post("http://localhost/dms/api/donationPending.php", {
                donor_id: user.user_id,
                campaign_id: campaign.campaign_id,
                quantity: quantity 
            });

            if (res.data.success) {
                alert("Donation request submitted successfully!");
                navigate("/campaigns");
            } else {
                alert("Donation failed: " + res.data.message);
            }
        } catch (err) {
            console.error("Donation error:", err);
            alert("Network or server error during donation.");
        }
    };

    return (
        <div className={myDonation.donationPage}>
            <h1>Donate to Campaign</h1>
            <h2>{campaign.title}</h2>
            <p>{campaign.description}</p>
            <p><strong>Target Quantity:</strong> {campaign.target_quantity}</p>
            <p><strong>End Date:</strong> {campaign.end_date}</p>

            <div className={myDonation.donationForm}>
                <form onSubmit={handleSubmit}>
                    <label>Quantity to Donate: </label>
                    <input type="number" name="quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
                    <button type="submit">Donate</button>
                </form>
            </div>
        </div>
    );
}
