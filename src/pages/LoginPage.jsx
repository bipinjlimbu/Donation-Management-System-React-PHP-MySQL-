import { Link } from "react-router-dom";
import myLogin from "../style/LSPage.module.css";
import { useAuth } from "../components/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginPage() {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "email") setEmail(value);
        else if (name === "password") setPassword(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email.trim() || !password.trim()) {
            alert("Please enter email and password");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post("http://localhost/dms/api/login.php", {
                email: email.trim(),
                password: password.trim()
            });

            if (response.data.success) {
                localStorage.setItem("user", JSON.stringify(response.data.user));
                login(response.data.user);
                navigate("/");
            } else {
                alert("Login failed: " + response.data.message);
            }
        } catch (err) {
            console.error(err);
            alert("Network or server error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={myLogin.pageWrapper}>
            <div className={myLogin.loginCard}>
                <h1 className={myLogin.title}>Welcome Back</h1>
                
                <form onSubmit={handleSubmit}>

                    <label className={myLogin.label}>Email:</label>
                    <input type="email" name="email" value={email} onChange={handleChange} className={myLogin.input} required />

                    <label className={myLogin.label}>Password:</label>
                    <input type="password" name="password" value={password} onChange={handleChange} className={myLogin.input} required />

                    <button type="submit" disabled={loading} className={myLogin.button}>
                        {loading ? "Logging in..." : "Login"}
                    </button>

                </form>
                
                <p className={myLogin.footerText}>Don't have an account? <Link to="/signup">Register here</Link></p>
            </div>
        </div>
    );
}
