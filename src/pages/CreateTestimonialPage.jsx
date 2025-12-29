import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

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
            const res = await axios.post("http://localhost/dms/api/createtestimonials.php", {
                user_id: user.user_id,
                message,
                rating
            });

            if (res.data.success) {
                navigate("/testimonials");
            } else {
                setError(res.data.message || "Failed to create testimonial.");
            }
        } catch (err) {
            setError("Server error. Please try again later.");
            console.error(err);
        }
    };

    return (
        <div>
            <h1>Create Testimonial</h1>

            {error && <p>{error}</p>}

            <form onSubmit={handleSubmit}>
                <label>
                    Your Message:
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows="5"
                        required
                    />
                </label>

                <label>
                    Rating:
                    <select
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                    >
                        {[5, 4, 3, 2, 1].map(num => (
                            <option key={num} value={num}>{num} Star{num > 1 ? "s" : ""}</option>
                        ))}
                    </select>
                </label>

                <button type="submit">
                    Submit Testimonial
                </button>
            </form>
        </div>
    );
}
