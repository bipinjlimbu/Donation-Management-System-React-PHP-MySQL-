import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import myTestimonials from "../style/CreateTestimonialPage.module.css";

export default function CreateTestimonialPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [rating, setRating] = useState(5);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            setError("You must be logged in to submit a testimonial.");
            return;
        }

        try {
            const res = await axios.post(
                "http://localhost/dms/api/createtestimonial.php",
                {
                    message,
                    rating
                },
                {
                    withCredentials: true
                }
            );

            if (res.data.success) {
                navigate("/testimonials");
            } else {
                setError(res.data.message || "Failed to create testimonial.");
            }
        } catch (err) {
            console.error(err);
            setError("Server error. Please try again later.");
        }
    };

    return (
        <div className={myTestimonials.page}>
            <h1 className={myTestimonials.title}>Create Testimonial</h1>

            {error && <p className={myTestimonials.error}>{error}</p>}

            <form onSubmit={handleSubmit} className={myTestimonials.form}>
                <label className={myTestimonials.label}>
                    Your Message:
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows="5"
                        required
                        className={myTestimonials.textarea}
                    />
                </label>

                <label className={myTestimonials.label}>
                    Rating:
                    <select
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        className={myTestimonials.select}
                    >
                        {[5, 4, 3, 2, 1].map(num => (
                            <option key={num} value={num}>
                                {num} Star{num > 1 ? "s" : ""}
                            </option>
                        ))}
                    </select>
                </label>

                <button type="submit" className={myTestimonials.submitBtn}>
                    Submit Testimonial
                </button>
            </form>
        </div>
    );
}
