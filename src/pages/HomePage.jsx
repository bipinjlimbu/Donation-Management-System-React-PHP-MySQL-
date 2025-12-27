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
        <section className={myHome.hero}>
            <div className={myHome.heroOverlay}>
                <h1 className={myHome.heroTitle}>
                Welcome to <span className={myHome.heroHighlight}>ShareHope</span>
                </h1>
                <p className={myHome.heroSubtitle}>
                Donate with purpose through trusted NGO campaigns
                </p>

                <p className={myHome.heroImpact}>
                Trusted by <span>500+</span> donors and <span>120+</span> NGOs
                </p>

                <div className={myHome.heroButtons}>
                <button
                    className={myHome.primaryBtn}
                    onClick={() => navigate("/campaigns")}
                >
                    Browse Campaigns
                </button>
                {!user && (
                    <button
                    className={myHome.secondaryBtn}
                    onClick={() => navigate("/signup")}
                    >
                    Get Started
                    </button>
                )}
                </div>
            </div>
        </section>

        <section className={myHome.quickAccess}>
            <h2 className={myHome.sectionTitle}>Quick Access</h2>

            <div className={myHome.quickGrid}>

                <div
                className={myHome.quickCard}
                onClick={() => navigate("/dashboard")}
                >
                <h3>Dashboard</h3>
                <p>View your activity and account overview</p>
                </div>

                <div
                className={myHome.quickCard}
                onClick={() => navigate("/notifications")}
                >
                <h3>Notifications</h3>
                <p>Check approvals, updates, and alerts</p>
                </div>

                <div
                className={myHome.quickCard}
                onClick={() => navigate("/donations")}
                >
                <h3>My Donations</h3>
                <p>Track your donation history</p>
                </div>

                <div
                className={myHome.quickCard}
                onClick={() => navigate("/campaigns")}
                >
                <h3>Campaigns</h3>
                <p>Browse or manage donation campaigns</p>
                </div>

            </div>
        </section>


        <section className={myHome.impactSection}>
            <h2 className={myHome.sectionTitle}>Our Impact So Far</h2>
            <div className={myHome.impactCards}>
                <div className={myHome.impactCard}>
                <h3 className={myHome.impactNumber}>1,250</h3>
                <p className={myHome.impactLabel}>Items Donated</p>
                </div>
                <div className={myHome.impactCard}>
                <h3 className={myHome.impactNumber}>120</h3>
                <p className={myHome.impactLabel}>Verified NGOs</p>
                </div>
                <div className={myHome.impactCard}>
                <h3 className={myHome.impactNumber}>500+</h3>
                <p className={myHome.impactLabel}>Active Donors</p>
                </div>
                <div className={myHome.impactCard}>
                <h3 className={myHome.impactNumber}>75</h3>
                <p className={myHome.impactLabel}>Active Campaigns</p>
                </div>
            </div>
        </section>

        <section className={myHome.latestCampaignsSection}>
            <h2 className={myHome.sectionTitle}>Latest Campaigns</h2>
            <div className={myHome.campaignCards}>
                {campaigns.slice(0, 4).map(campaign => (
                <div key={campaign.campaign_id} className={myHome.campaignCard}>
                    <h3 className={myHome.cardTitle}>{campaign.title}</h3>
                    <p className={myHome.cardDescription}>{campaign.description}</p>

                    <span className={`${myHome.statusBadge} ${myHome[campaign.status.toLowerCase()]}`}>
                    {campaign.status}
                    </span>

                    <div className={myHome.cardFooter}>
                    <p><strong>Target:</strong> {campaign.target_quantity} {campaign.unit}</p>
                    <p><strong>Collected:</strong> {campaign.collected_quantity} {campaign.unit}</p>
                    </div>
                    <button 
                    className={myHome.viewDetailsBtn} 
                    onClick={() => navigate(`/campaigns/${campaign.campaign_id}`)}
                    >
                    View Details
                    </button>
                </div>
                ))}
            </div>

            <button className={myHome.moreCampaignsBtn} onClick={() => navigate("/campaigns")}>
                View All Campaigns
            </button>
        </section>

        <section className={myHome.howItWorks}>
            <h2 className={myHome.sectionTitle}>How It Works</h2>
            <div className={myHome.stepsContainer}>

                <div className={myHome.stepCard}>
                <div className={myHome.stepIcon}>📦</div>
                <h3 className={myHome.stepTitle}>Select a Campaign</h3>
                <p className={myHome.stepDescription}>
                    Browse through trusted NGO campaigns and choose the one you want to support.
                </p>
                </div>

                <div className={myHome.stepCard}>
                <div className={myHome.stepIcon}>✍️</div>
                <h3 className={myHome.stepTitle}>Make a Donation</h3>
                <p className={myHome.stepDescription}>
                    Donate items or funds securely through our platform with ease.
                </p>
                </div>

                <div className={myHome.stepCard}>
                <div className={myHome.stepIcon}>🤝</div>
                <h3 className={myHome.stepTitle}>Track Your Impact</h3>
                <p className={myHome.stepDescription}>
                    See your donations reach those in need and track your contribution history.
                </p>
                </div>

                <div className={myHome.stepCard}>
                <div className={myHome.stepIcon}>🌟</div>
                <h3 className={myHome.stepTitle}>Make a Difference</h3>
                <p className={myHome.stepDescription}>
                    Feel the joy of giving and help NGOs achieve their goals efficiently.
                </p>
                </div>

            </div>
        </section>


        </div>
    )
}