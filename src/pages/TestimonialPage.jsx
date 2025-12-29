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
        axios
            .get("http://localhost/dms/api/testimonials.php")
            .then(res => {
                if (res.data.success) {
                    setTestimonials(res.data.testimonials);
                }
            })
            .catch(err => {
                console.error(err);
            });
    }, []);

    return (
        <div className={myTestimonial.page}>
            <div className={myTestimonial.header}>
                <h1 className={myTestimonial.title}>All Testimonials</h1>
                <p className={myTestimonial.subtitle}>
                    Hear from donors and NGOs who use ShareHope
                </p>
            </div>

            {user && (
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
                {testimonials.length === 0 ? (
                    <p className={myTestimonial.empty}>
                        No testimonials available.
                    </p>
                ) : (
                    testimonials.map(t => (
                        <div
                            key={t.testimonial_id}
                            className={myTestimonial.card}
                        >
                            <p className={myTestimonial.message}>
                                “{t.message}”
                            </p>

                            <div className={myTestimonial.footer}>
                                <span className={myTestimonial.name}>
                                    {t.name}
                                </span>
                                <span className={myTestimonial.role}>
                                    {t.role}
                                </span>
                            </div>

                            {t.rating && (
                                <div className={myTestimonial.rating}>
                                    {"★".repeat(t.rating)}
                                    {"☆".repeat(5 - t.rating)}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
