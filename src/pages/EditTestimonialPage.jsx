import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../components/AuthContext";
import styles from "../style/EditTestimonialPage.module.css";

export default function EditTestimonialPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [message, setMessage] = useState("");
    const [rating, setRating] = useState(5);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        axios
            .get(
                `http://localhost/dms/api/getSingleTestimonial.php?id=${id}`,
                { withCredentials: true }
            )
            .then(res => {
                if (res.data.success) {
                    setMessage(res.data.testimonial.message);
                    setRating(res.data.testimonial.rating);
                } else {
                    setError(res.data.message);
                }
            })
            .catch(() => setError("Failed to load testimonial"))
            .finally(() => setLoading(false));
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(
                "http://localhost/dms/api/updateTestimonial.php",
                {
                    testimonial_id: id,
                    message,
                    rating
                },
                { withCredentials: true }
            );

            if (res.data.success) {
                alert("Testimonial updated");
                navigate("/testimonials");
            } else {
                alert(res.data.message);
            }
        } catch {
            alert("Server error");
        }
    };

    if (!user) return <p>Login required</p>;
    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div className={styles.container}>
            <h1>Edit Testimonial</h1>

            <form onSubmit={handleSubmit} className={styles.form}>
                <label>Message</label>
                <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    required
                />

                <label>Rating</label>
                <select
                    value={rating}
                    onChange={e => setRating(Number(e.target.value))}
                >
                    <option value={1}>1 Star</option>
                    <option value={2}>2 Stars</option>
                    <option value={3}>3 Stars</option>
                    <option value={4}>4 Stars</option>
                    <option value={5}>5 Stars</option>
                </select>

                <button type="submit">Update Testimonial</button>
            </form>
        </div>
    );
}
