import { Link } from "react-router-dom";
import myLogin from "../style/LSPage.module.css";
import Footer from "../layout/Footer";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function SignUpPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "email") setEmail(value);
        else if (name === "password") setPassword(value);
        else if (name === "confirmPassword") setConfirmPassword(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email.trim() || !password.trim()) {
            alert("All fields are required!");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        if (password.length < 8) {
            alert("Password must be at least 8 characters");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post("http://localhost/dms/api/signup.php", {
                email: email.trim(),
                password: password.trim()
            },
            {
                headers: { "Content-Type": "application/json" }
            });

            if (response.data.success) {
                alert("Signup successful! Please login.");
                navigate("/login");
            } else {
                alert("Signup failed: " + response.data.message);
            }
        } catch (err) {
            console.error(err);
            alert("Network or server error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={myLogin.login}>
            <h1>Join Us</h1>
            <form onSubmit={handleSubmit}>
                <label>Email:</label>
                <input type="email" name="email" value={email} onChange={handleChange} required />
                <br/>
                <label>Password:</label>
                <input type="password" name="password" value={password} onChange={handleChange} required />
                <br/>
                <label>Confirm Password:</label>
                <input type="password" name="confirmPassword" value={confirmPassword} onChange={handleChange} required />
                <br/>
                <button type="submit" disabled={loading}>{loading ? "Signing Up..." : "Sign Up"}</button>
            </form>
            <p>Already have an account? <Link to="/login">Login here</Link></p>
            <Footer/>
        </div>
    );
}
