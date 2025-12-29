import { useState, useEffect } from "react";
import axios from "axios";

export default function TestimonialPage() {
    const [testimonials, setTestimonials] = useState([]);

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
        <div>
            <h1>Testimonials Page</h1>
        </div>
    );
}