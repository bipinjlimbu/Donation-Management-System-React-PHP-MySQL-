import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import myDonation from "../style/DonationPage.module.css";
import axios from "axios";

export default function DonationPage() {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [campaign, setCampaign] = useState(null);
    const [quantity, setQuantity] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        axios
            .get(`http://localhost/dms/api/singlecampaigns.php?id=${id}`, {
                withCredentials: true
            })
            .then(res => {
                if (res.data.success) {
                    setCampaign(res.data.campaign);
                } else {
                    setError(res.data.message || "Failed to load campaign");
                }
            })
            .catch(() => setError("Failed to connect to the server"))
            .finally(() => setLoading(false));
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user || user.role !== "Donor") {
            alert("Only donors can donate.");
            return;
        }

        if (!quantity || quantity <= 0) {
            alert("Please enter a valid quantity.");
            return;
        }

        try {
            const res = await axios.post(
                "http://localhost/dms/api/donate.php",
                {
                    campaign_id: campaign.campaign_id,
                    quantity: quantity
                },
                { withCredentials: true }
            );

            if (res.data.success) {
                alert("Donation request submitted successfully!");
                navigate("/campaigns");
            } else {
                alert(res.data.message || "Donation failed");
            }
        } catch {
            alert("Network or server error during donation.");
        }
    };

    if (loading) return <div>Loading donation page...</div>;
    if (error) return <div style={{ color: "red" }}>{error}</div>;
    if (!campaign) return <div>No campaign found.</div>;

    return (
        <div className={myDonation.donationPage}>
            <h1>Donate to Campaign</h1>
            <h2>{campaign.title}</h2>
            <p>{campaign.description}</p>
            <p><strong>Target Quantity:</strong> {campaign.target_quantity}</p>
            <p><strong>End Date:</strong> {campaign.end_date}</p>

            <div className={myDonation.donationForm}>
                <form onSubmit={handleSubmit}>
                    <label>Quantity to Donate</label>
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        required
                    />
                    <button type="submit">Donate</button>
                </form>
            </div>
        </div>
    );
}
