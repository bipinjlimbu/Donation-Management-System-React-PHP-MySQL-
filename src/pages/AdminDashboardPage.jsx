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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [signRes, userRes, campRes, historyRes, testRes] = await Promise.all([
                    axios.get("http://localhost/dms/api/fetchSignupRequests.php"),
                    axios.get("http://localhost/dms/api/fetchUserRequests.php"),
                    axios.get("http://localhost/dms/api/fetchCampaignRequests.php"),
                    axios.get(`http://localhost/dms/api/fetchDonationHistory.php?user_id=${user.user_id}`),
                    axios.get("http://localhost/dms/api/fetchTestimonials.php")
                ]);

                if (signRes.data.success) setSignupRequests(signRes.data.requests);
                if (userRes.data.success) setUserRequests(userRes.data.requests);
                if (campRes.data.success) setCampaignRequests(campRes.data.requests);
                if (historyRes.data.success) setRecords(historyRes.data.donations);
                if (testRes.data.success) setTestimonials(testRes.data.testimonials);

            } catch {
                setError("Failed loading admin dashboard data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);    

    const handleSignupApprove = async (id) => {
        const res = await axios.post("http://localhost/dms/api/approveSignup.php", { register_id: id });
        if (res.data.success)
            setSignupRequests(prev => prev.filter(r => r.register_id !== id));
    };

    const handleSignupDeny = async (id) => {
        const res = await axios.post("http://localhost/dms/api/denySignup.php", { register_id: id });
        if (res.data.success)
            setSignupRequests(prev => prev.filter(r => r.register_id !== id));
    };

    const handleUserApprove = async (id, role) => {
        const res = await axios.post("http://localhost/dms/api/approveUserRequest.php", { user_id: id, role });
        if (res.data.success)
            setUserRequests(prev => prev.filter(r => r.user_id !== id));
    };

    const handleUserDeny = async (id, role) => {
        const res = await axios.post("http://localhost/dms/api/denyUserRequest.php", { user_id: id, role });
        if (res.data.success)
            setUserRequests(prev => prev.filter(r => r.user_id !== id));
    };

    const handleCampaignApprove = async (campaign_id) => {
        const res = await axios.post("http://localhost/dms/api/approveCampaignRequest.php", { campaign_id });
        if (res.data.success)
            setCampaignRequests(prev => prev.filter(r => r.campaign_id !== campaign_id));
    };

    const handleCampaignDeny = async (campaign_id) => {
        const res = await axios.post("http://localhost/dms/api/denyCampaignRequest.php", { campaign_id });
        if (res.data.success)
            setCampaignRequests(prev => prev.filter(r => r.campaign_id !== campaign_id));
    };

    const handleTestimonialApprove = async (id) => {
        const res = await axios.post("http://localhost/dms/api/approveTestimonial.php", { testimonial_id: id });
        if (res.data.success)
            setTestimonials(prev => prev.filter(t => t.testimonial_id !== id));
    };

    const handleTestimonialDeny = async (id) => {
        const res = await axios.post("http://localhost/dms/api/denyTestimonial.php", { testimonial_id: id });
        if (res.data.success)
            setTestimonials(prev => prev.filter(t => t.testimonial_id !== id));
    };

    if (loading) return <p>Loading Admin Dashboard...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Admin Dashboard</h1>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Pending Signup Requests</h2>

                {signupRequests.length > 0 ? (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>Name</th>
                                <th>Phone</th>
                                <th>Address</th>
                                <th>Role</th>
                                <th>Registration Number</th>
                                <th>Verification File</th>
                                <th>Requested At</th>
                                <th>Approve</th>
                                <th>Deny</th>
                            </tr>
                        </thead>
                        <tbody>
                            {signupRequests.map(r => (
                                <tr key={r.register_id}>
                                    <td>{r.email}</td>
                                    <td>{r.name}</td>
                                    <td>{r.phone}</td>
                                    <td>{r.address}</td>
                                    <td>{r.role}</td>
                                    <td>{r.role === "NGO" ? r.registration_number : "-"}</td>
                                    <td>
                                        {r.role === "NGO"
                                            ? <a href={`http://localhost/dms/api/${r.verification_file}`} target="_blank">View File</a>
                                            : "-"
                                        }
                                    </td>
                                    <td>{r.requested_at}</td>

                                    <td>
                                        <button className={styles.approveBtn}
                                            onClick={() => handleSignupApprove(r.register_id)}>
                                            Approve
                                        </button>
                                    </td>

                                    <td>
                                        <button className={styles.denyBtn}
                                            onClick={() => handleSignupDeny(r.register_id)}>
                                            Deny
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : <p>No new signup requests.</p>}
            </div>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Pending User Profile Change Requests</h2>

                {userRequests.length > 0 ? (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>User ID</th>
                                <th>Role</th>
                                <th>Current Name</th>
                                <th>New Name</th>
                                <th>Current Phone</th>
                                <th>New Phone</th>
                                <th>Current Address</th>
                                <th>New Address</th>
                                <th>Status</th>
                                <th>Requested At</th>
                                <th>Approve</th>
                                <th>Deny</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userRequests.map(req => (
                                <tr key={req.user_id}>
                                    <td>{req.user_id}</td>
                                    <td>{req.role}</td>
                                    <td>{req.current_name}</td>
                                    <td>{req.new_name}</td>
                                    <td>{req.current_phone}</td>
                                    <td>{req.new_phone}</td>
                                    <td>{req.current_address}</td>
                                    <td>{req.new_address}</td>
                                    <td>{req.status}</td>
                                    <td>{req.requested_at}</td>

                                    <td>
                                        <button className={styles.approveBtn}
                                            onClick={() => handleUserApprove(req.user_id, req.role)}>
                                            Approve
                                        </button>
                                    </td>
                                    <td>
                                        <button className={styles.denyBtn}
                                            onClick={() => handleUserDeny(req.user_id, req.role)}>
                                            Deny
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : <p>No user requests.</p>}
            </div>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Pending Campaign Creation Requests</h2>

                {campaignRequests.length > 0 ? (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Target Qty</th>
                                <th>Status</th>
                                <th>Requested By</th>
                                <th>Requested At</th>
                                <th>Approve</th>
                                <th>Deny</th>
                            </tr>
                        </thead>
                        <tbody>
                            {campaignRequests.map(req => (
                                <tr key={req.campaign_id}>
                                    <td>{req.title}</td>
                                    <td>{req.description}</td>
                                    <td>{req.target_quantity}</td>
                                    <td>{req.status}</td>
                                    <td>{req.ngo_name}</td>
                                    <td>{req.requested_at}</td>

                                    <td>
                                        <button className={styles.approveBtn}
                                            onClick={() => handleCampaignApprove(req.campaign_id)}>
                                            Approve
                                        </button>
                                    </td>

                                    <td>
                                        <button className={styles.denyBtn}
                                            onClick={() => handleCampaignDeny(req.campaign_id)}>
                                            Deny
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : <p>No campaign requests.</p>}
            </div>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Pending Testimonials</h2>

                {testimonials.length > 0 ? (
                    <div className={styles.cardGrid}>
                        {testimonials.map(t => {
                            const name =
                                t.role === "NGO" ? t.ngo_name : t.donor_name;

                            return (
                                <div key={t.testimonial_id} className={styles.testimonialCard}>
                                    
                                    <div className={styles.cardHeader}>
                                        <div className={styles.avatar}>
                                            {name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className={styles.testimonialName}>{name}</div>
                                            <div className={styles.testimonialRole}>{t.role}</div>
                                            <div className={styles.testimonialEmail}>{t.email}</div>
                                        </div>
                                    </div>

                                    <div className={styles.messageBox}>
                                        “{t.message}”
                                    </div>

                                    <div className={styles.cardFooter}>
                                        <div className={styles.testimonialRating}>
                                            {"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}
                                        </div>

                                        <div className={styles.cardButtons}>
                                            <button
                                                className={styles.approveBtn}
                                                onClick={() => handleTestimonialApprove(t.testimonial_id)}
                                            >
                                                Approve
                                            </button>
                                            <button
                                                className={styles.denyBtn}
                                                onClick={() => handleTestimonialDeny(t.testimonial_id)}
                                            >
                                                Deny
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            );
                        })}
                    </div>
                ) : <p>No pending testimonials.</p>}
            </div>

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

                        <button className={styles.viewBtn}
                            onClick={() => navigate("/records")}>
                            View All Records
                        </button>
                    </>
                ) : <p>No donation history.</p>}
            </div>

        </div>
    );
}
