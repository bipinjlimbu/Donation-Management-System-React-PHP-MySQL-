import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";
import myTestimonial from "../style/TestimonialPage.module.css";

export default function TestimonialPage() {
    const [testimonials, setTestimonials] = useState([]);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost/dms/api/testimonials.php")
            .then(res => {
                if (res.data.success) {
                    setTestimonials(res.data.testimonials);
                }
            });
    }, []);

    const canWrite = user && (user.role === "Donor" || user.role === "NGO");

    return (
        <div className={myTestimonial.page}>
            <div className={myTestimonial.header}>
                <h1 className={myTestimonial.title}>Testimonials</h1>
                <p className={myTestimonial.subtitle}>
                    Voices from donors and NGOs
                </p>
            </div>

            {canWrite && (
                <div className={myTestimonial.createWrapper}>
                    <button
                        className={myTestimonial.primaryBtn}
                        onClick={() => navigate("/testimonials/create")}
                    >
                        Write a Testimonial
                    </button>
                </div>
            )}

            <div className={myTestimonial.grid}>
                {testimonials.map(t => {
                    const isOwner = user && user.user_id === t.user_id;
                    const name = t.role === "NGO" ? t.ngo_name : t.donor_name;

                    return (
                        <div key={t.testimonial_id} className={myTestimonial.card}>
                            <p className={myTestimonial.message}>“{t.message}”</p>

                            <div className={myTestimonial.info}>
                                <span className={myTestimonial.name}>{name}</span>
                                <span className={myTestimonial.role}>{t.role}</span>
                            </div>

                            <div className={myTestimonial.rating}>
                                {"★".repeat(t.rating)}
                                {"☆".repeat(5 - t.rating)}
                            </div>

                            {isOwner && (
                                <div className={myTestimonial.actions}>
                                    <button
                                        className={myTestimonial.editBtn}
                                        onClick={() => navigate(`/testimonials/edit/${t.testimonial_id}`)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className={myTestimonial.deleteBtn}
                                        onClick={() => navigate(`/testimonials/delete/${t.testimonial_id}`)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
