import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";
import styles from "../style/TestimonialPage.module.css";

export default function TestimonialPage() {
    const [testimonials, setTestimonials] = useState([]);
    const [hasWritten, setHasWritten] = useState(false);

    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get("http://localhost/dms/api/testimonials.php", {
                withCredentials: true
            })
            .then(res => {
                if (res.data.success) {
                    setTestimonials(res.data.testimonials);
                    setHasWritten(res.data.hasWritten);
                }
            })
            .catch(() => {
                console.error("Failed to fetch testimonials");
            });
    }, []);

    const handleDelete = async (testimonial_id) => {
        if (!window.confirm("Are you sure you want to delete this testimonial?")) return;

        try {
            const res = await axios.post(
                "http://localhost/dms/api/deleteTestimonial.php",
                { testimonial_id },
                { withCredentials: true }
            );

            if (res.data.success) {
                alert("Testimonial deleted");

                setTestimonials(prev =>
                    prev.filter(t => t.testimonial_id !== testimonial_id)
                );

                setHasWritten(false);
            } else {
                alert(res.data.message);
            }
        } catch {
            alert("Server error");
        }
    };

    const canWrite =
        user &&
        (user.role === "Donor" || user.role === "NGO") &&
        !hasWritten;

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.title}>Testimonials</h1>
                <p className={styles.subtitle}>
                    Voices from donors and NGOs
                </p>
            </div>

            {canWrite && (
                <div className={styles.createWrapper}>
                    <button
                        className={styles.primaryBtn}
                        onClick={() => navigate("/testimonials/create")}
                    >
                        Write a Testimonial
                    </button>
                </div>
            )}

            <div className={styles.grid}>
                {testimonials.length === 0 ? (
                    <p className={styles.empty}>No testimonials available.</p>
                ) : (
                    testimonials.map(t => {
                        const name =
                            t.role === "NGO" ? t.ngo_name : t.donor_name;

                        const isOwner =
                            user && Number(user.user_id) === Number(t.user_id);

                        const isAdmin = user?.role === "Admin";

                        return (
                            <div key={t.testimonial_id} className={styles.card}>
                                <div className={styles.cardHeader}>
                                    <div className={styles.avatar}>
                                        {name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className={styles.name}>{name}</div>
                                        <div className={styles.role}>{t.role}</div>
                                    </div>
                                </div>

                                <div className={styles.messageBox}>
                                    “{t.message}”
                                </div>

                                <div className={styles.cardFooter}>
                                    <div className={styles.rating}>
                                        {"★".repeat(t.rating)}
                                        {"☆".repeat(5 - t.rating)}
                                    </div>

                                    {(isOwner || isAdmin) && (
                                        <div className={styles.actions}>
                                            <button
                                                className={styles.editBtn}
                                                onClick={() =>
                                                    navigate(`/testimonials/edit/${t.testimonial_id}`)
                                                }
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className={styles.deleteBtn}
                                                onClick={() =>
                                                    handleDelete(t.testimonial_id)
                                                }
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
