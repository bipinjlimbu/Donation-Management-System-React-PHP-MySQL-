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
    const [testimonials, setTestimonials] = useState([]);

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

    useEffect(() => {
    axios
        .get("http://localhost/dms/api/testimonials.php")
        .then(res => {
        if (res.data.success) {
            setTestimonials(res.data.testimonials);
        } else {
            console.error(res.data.message || "Failed to load testimonials");
        }
        })
        .catch(err => {
        console.error("Failed to fetch testimonials:", err);
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
                onClick={() => navigate("/records")}
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

        <section className={myHome.features}>
        <h2 className={myHome.sectionTitle}>Platform Features</h2>

        <div className={myHome.featuresGrid}>

            <div className={myHome.featureCard}>
            <h3>Easy Item Donations</h3>
            <p>
                Donate essential items directly to NGO campaigns with full transparency
                and tracking.
            </p>
            </div>

            <div className={myHome.featureCard}>
            <h3>Campaign Management</h3>
            <p>
                NGOs can create, manage, and track donation campaigns efficiently in one place.
            </p>
            </div>

            <div className={myHome.featureCard}>
            <h3>Notifications System</h3>
            <p>
                Stay updated with real-time notifications on approvals, donations, and updates.
            </p>
            </div>

            <div className={myHome.featureCard}>
            <h3>Secure Authentication</h3>
            <p>
                Role-based access for Donors, NGOs, and Admins ensures data safety.
            </p>
            </div>

            <div className={myHome.featureCard}>
            <h3>Donation Tracking</h3>
            <p>
                Monitor donation status from request to delivery with complete visibility.
            </p>
            </div>

            <div className={myHome.featureCard}>
            <h3>Admin Verification</h3>
            <p>
                Campaigns and users are verified by admins to ensure platform trust.
            </p>
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

        <section className={myHome.trust}>
        <h2 className={myHome.sectionTitle}>Trust & Transparency</h2>

        <div className={myHome.trustGrid}>

            <div className={myHome.trustCard}>
            <h3>Verified NGOs</h3>
            <p>
                All NGOs are verified by admins before they can create campaigns.
            </p>
            </div>

            <div className={myHome.trustCard}>
            <h3>Admin Approved Campaigns</h3>
            <p>
                Every campaign goes through an approval process to ensure authenticity.
            </p>
            </div>

            <div className={myHome.trustCard}>
            <h3>Transparent Tracking</h3>
            <p>
                Donors can track donation status from request to delivery.
            </p>
            </div>

            <div className={myHome.trustCard}>
            <h3>Real-time Notifications</h3>
            <p>
                Users receive notifications for approvals, donations, and updates.
            </p>
            </div>

        </div>
        </section>

        <section className={myHome.testimonials}>
            <h2 className={myHome.sectionTitle}>What People Say About Us</h2>

            <div className={myHome.testimonialGrid}>
                {testimonials.length === 0 ? (
                    <p className={myHome.noTestimonials}>No testimonials available yet.</p>
                ) : (
                    testimonials.slice(0, 3).map(t => {
                        const name = t.role === "NGO" ? t.ngo_name : t.donor_name;
                        return (
                            <div key={t.testimonial_id} className={myHome.testimonialCard}>

                                <div className={myHome.cardHeader}>
                                    <div className={myHome.avatar}>
                                        {name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className={myHome.testimonialName}>{name}</div>
                                        <div className={myHome.testimonialRole}>{t.role}</div>
                                    </div>
                                </div>

                                <div className={myHome.testimonialMessage}>
                                    “{t.message}”
                                </div>

                                <div className={myHome.testimonialFooter}>
                                    <div className={myHome.testimonialRating}>
                                        {"★".repeat(t.rating)}
                                        {"☆".repeat(5 - t.rating)}
                                    </div>
                                </div>

                            </div>
                        );
                    })
                )}
            </div>

            <div className={myHome.testimonialActions}>
                {user && (
                    <button
                        className={myHome.primaryBtn}
                        onClick={() => navigate("/testimonials/create")}
                    >
                        Write a Testimonial
                    </button>
                )}
                <button
                    className={myHome.secondaryBtn}
                    onClick={() => navigate("/testimonials")}
                >
                    View All Testimonials
                </button>
            </div>
        </section>

        <section className={myHome.cta}>
        <h2>Ready to Make a Difference?</h2>

        <p>
            Join ShareHope today and help NGOs reach communities in need through
            transparent and impactful donations.
        </p>

        <div className={myHome.ctaButtons}>
            <button
            className={myHome.ctaPrimary}
            onClick={() => navigate("/campaigns")}
            >
            Browse Campaigns
            </button>

            {!user && (
            <button
                className={myHome.ctaSecondary}
                onClick={() => navigate("/signup")}
            >
                Get Started
            </button>
            )}
        </div>
        </section>

        </div>
    )
}