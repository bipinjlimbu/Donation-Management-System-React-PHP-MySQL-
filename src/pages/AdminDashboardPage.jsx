import { useState, useEffect } from "react";
import axios from "axios";
import styles from "../style/AdminDashboardPage.module.css";
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminDashboardPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [signupRequests, setSignupRequests] = useState([]);
    const [userRequests, setUserRequests] = useState([]);
    const [campaignRequests, setCampaignRequests] = useState([]);
    const [records, setRecords] = useState([]);
    const [testimonials, setTestimonials] = useState([]);
    const [error, setError] = useState("");

    // Fetch all data on load
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [signRes, userRes, campRes, historyRes, testRes] = await Promise.all([
                    axios.get("http://localhost/dms/api/fetchSignupRequests.php", { withCredentials: true }),
                    axios.get("http://localhost/dms/api/fetchUserRequests.php", { withCredentials: true }),
                    axios.get("http://localhost/dms/api/fetchCampaignRequests.php", { withCredentials: true }),
                    axios.get(`http://localhost/dms/api/fetchDonationHistory.php?user_id=${user?.user_id}`, { withCredentials: true }),
                    axios.get("http://localhost/dms/api/fetchTestimonials.php", { withCredentials: true }),
                ]);

                if (signRes.data.success) setSignupRequests(signRes.data.requests);
                if (userRes.data.success) setUserRequests(userRes.data.requests);
                if (campRes.data.success) setCampaignRequests(campRes.data.requests);
                if (historyRes.data.success) setRecords(historyRes.data.donations);
                if (testRes.data.success) setTestimonials(testRes.data.testimonials);

            } catch {
                setError("Failed loading admin dashboard data.");
            }
        };

        fetchData();
    }, [user]);

    // ---------------- Handlers ----------------
    const handleSignupApprove = async (id) => {
        const res = await axios.post("http://localhost/dms/api/approveSignup.php", { register_id: id }, { withCredentials: true });
        if (res.data.success) setSignupRequests(prev => prev.filter(r => r.register_id !== id));
    };
    const handleSignupDeny = async (id) => {
        const res = await axios.post("http://localhost/dms/api/denySignup.php", { register_id: id }, { withCredentials: true });
        if (res.data.success) setSignupRequests(prev => prev.filter(r => r.register_id !== id));
    };
    const handleUserApprove = async (id, role) => {
        const res = await axios.post("http://localhost/dms/api/approveUserRequest.php", { user_id: id, role }, { withCredentials: true });
        if (res.data.success) setUserRequests(prev => prev.filter(r => r.user_id !== id));
    };
    const handleUserDeny = async (id, role) => {
        const res = await axios.post("http://localhost/dms/api/denyUserRequest.php", { user_id: id, role }, { withCredentials: true });
        if (res.data.success) setUserRequests(prev => prev.filter(r => r.user_id !== id));
    };
    const handleCampaignApprove = async (id) => {
        const res = await axios.post("http://localhost/dms/api/approveCampaignRequest.php", { campaign_id: id }, { withCredentials: true });
        if (res.data.success) setCampaignRequests(prev => prev.filter(r => r.campaign_id !== id));
    };
    const handleCampaignDeny = async (id) => {
        const res = await axios.post("http://localhost/dms/api/denyCampaignRequest.php", { campaign_id: id }, { withCredentials: true });
        if (res.data.success) setCampaignRequests(prev => prev.filter(r => r.campaign_id !== id));
    };
    const handleTestimonialApprove = async (id) => {
        const res = await axios.post("http://localhost/dms/api/approveTestimonial.php", { testimonial_id: id }, { withCredentials: true });
        if (res.data.success) setTestimonials(prev => prev.filter(t => t.testimonial_id !== id));
    };
    const handleTestimonialDeny = async (id) => {
        const res = await axios.post("http://localhost/dms/api/denyTestimonial.php", { testimonial_id: id }, { withCredentials: true });
        if (res.data.success) setTestimonials(prev => prev.filter(t => t.testimonial_id !== id));
    };

    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Admin Dashboard</h1>

            {/* ---------- Signup Requests ---------- */}
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Pending Signup Requests</h2>
                {signupRequests.length > 0 ? (
                    <div className={styles.cardGrid}>
                        {signupRequests.map(r => (
                            <div key={r.register_id} className={styles.requestCard}>
                                <div className={styles.cardHeaderUnderline}>
                                    <span>{r.name} ({r.role})</span>
                                </div>
                                <div className={styles.cardBody}>
                                    <p><b>Email:</b> {r.email}</p>
                                    <p><b>Phone:</b> {r.phone}</p>
                                    <p><b>Address:</b> {r.address}</p>
                                    {r.role === "NGO" && (
                                        <>
                                            <p><b>Registration No:</b> {r.registration_number}</p>
                                            <p><b>Verification File:</b> <a href={`http://localhost/dms/api/${r.verification_file}`} target="_blank">View</a></p>
                                        </>
                                    )}
                                    <p><b>Requested At:</b> {r.requested_at}</p>
                                </div>
                                <div className={styles.cardFooter}>
                                    <button className={styles.approveBtn} onClick={() => handleSignupApprove(r.register_id)}>Approve</button>
                                    <button className={styles.denyBtn} onClick={() => handleSignupDeny(r.register_id)}>Deny</button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : <p>No new signup requests.</p>}
            </div>

            {/* ---------- User Requests ---------- */}
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Pending User Profile Change Requests</h2>
                {userRequests.length > 0 ? (
                    <div className={styles.cardGrid}>
                        {userRequests.map(req => (
                            <div key={req.user_id} className={styles.requestCard}>
                                <div className={styles.cardHeaderUnderline}>
                                    <span>{req.current_name} ({req.role})</span>
                                </div>
                                <div className={styles.cardBody}>
                                    <p><b>Current Phone:</b> {req.current_phone}</p>
                                    <p><b>New Phone:</b> {req.new_phone}</p>
                                    <p><b>Current Address:</b> {req.current_address}</p>
                                    <p><b>New Address:</b> {req.new_address}</p>
                                    <p><b>Status:</b> {req.status}</p>
                                    <p><b>Requested At:</b> {req.requested_at}</p>
                                </div>
                                <div className={styles.cardFooter}>
                                    <button className={styles.approveBtn} onClick={() => handleUserApprove(req.user_id, req.role)}>Approve</button>
                                    <button className={styles.denyBtn} onClick={() => handleUserDeny(req.user_id, req.role)}>Deny</button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : <p>No user requests.</p>}
            </div>

            {/* ---------- Campaign Requests ---------- */}
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Pending Campaign Creation Requests</h2>
                {campaignRequests.length > 0 ? (
                    <div className={styles.cardGrid}>
                        {campaignRequests.map(req => (
                            <div key={req.campaign_id} className={styles.requestCard}>
                                <div className={styles.cardHeaderUnderline}>
                                    <span>{req.title}</span>
                                </div>
                                <div className={styles.cardBody}>
                                    <p><b>Description:</b> {req.description}</p>
                                    <p><b>Target Qty:</b> {req.target_quantity}</p>
                                    <p><b>Status:</b> {req.status}</p>
                                    <p><b>Requested By:</b> {req.ngo_name}</p>
                                    <p><b>Requested At:</b> {req.requested_at}</p>
                                </div>
                                <div className={styles.cardFooter}>
                                    <button className={styles.approveBtn} onClick={() => handleCampaignApprove(req.campaign_id)}>Approve</button>
                                    <button className={styles.denyBtn} onClick={() => handleCampaignDeny(req.campaign_id)}>Deny</button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : <p>No campaign requests.</p>}
            </div>

            {/* ---------- Testimonials ---------- */}
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Pending Testimonials</h2>
                {testimonials.length > 0 ? (
                    <div className={styles.testimonialGrid}>
                        {testimonials.map(t => {
                            const name = t.role === "NGO" ? t.ngo_name : t.donor_name;
                            return (
                                <div key={t.testimonial_id} className={styles.testimonialCard}>
                                    <div className={styles.cardHeader}>
                                        <div className={styles.avatar}>{name?.charAt(0).toUpperCase()}</div>
                                        <div>
                                            <div className={styles.testimonialName}>{name}</div>
                                            <div className={styles.testimonialRole}>{t.role}</div>
                                            <div className={styles.testimonialEmail}>{t.email}</div>
                                        </div>
                                    </div>
                                    <div className={styles.messageBox}>“{t.message}”</div>
                                    <div className={styles.cardFooter}>
                                        <button className={styles.approveBtn} onClick={() => handleTestimonialApprove(t.testimonial_id)}>Approve</button>
                                        <button className={styles.denyBtn} onClick={() => handleTestimonialDeny(t.testimonial_id)}>Deny</button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : <p>No pending testimonials.</p>}
            </div>

            {/* ---------- Donation History ---------- */}
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>All Donation History</h2>
                {records.length > 0 ? (
                    <>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Campaign</th>
                                    <th>Item</th>
                                    <th>Qty</th>
                                    <th>Donor</th>
                                    <th>NGO</th>
                                    <th>Location</th>
                                    <th>Status</th>
                                    <th>Delivered At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {records.slice(0, 3).map(rec => (
                                    <tr key={rec.donation_id}>
                                        <td>{rec.campaign_title}</td>
                                        <td>{rec.item_name}</td>
                                        <td>{rec.quantity}</td>
                                        <td>{rec.donor_name}</td>
                                        <td>{rec.ngo_name}</td>
                                        <td>{rec.ngo_address}</td>
                                        <td>{rec.status}</td>
                                        <td>{rec.delivered_at || "-"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button className={styles.viewBtn} onClick={() => navigate("/records")}>View All Records</button>
                    </>
                ) : <p>No donation history.</p>}
            </div>
        </div>
    );
}