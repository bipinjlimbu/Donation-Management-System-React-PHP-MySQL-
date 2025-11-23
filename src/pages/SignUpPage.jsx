import { Link } from "react-router-dom";
import myLogin from "../style/LSPage.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function SignUpPage() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        role: "Donor",
        registration_number: ""
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email.trim() || !formData.password.trim()) {
            alert("All fields are required!");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        if (formData.password.length < 8) {
            alert("Password must be at least 8 characters");
            return;
        }

        if (formData.role === "NGO" && !formData.registration_number.trim()) {
            alert("Registration number is required for NGOs!");
            return;
        }

        try {
            const response = await axios.post("http://localhost/dms/api/signup.php", {
                email: formData.email.trim(),
                password: formData.password.trim(),
                role: formData.role,
                registration_number: formData.role === "NGO" ? formData.registration_number.trim() : null
            });

            if (response.data.success) {
                alert(response.data.message);
                navigate("/login");
            } else {
                alert("Signup failed: " + response.data.message);
            }
        } catch (err) {
            console.error(err);
            alert("Network or server error");
        }
    };

    return (
        <div className={myLogin.login}>
            <h1>Join Us</h1>
            <form onSubmit={handleSubmit}>                
                <label>Email:</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                
                <label>Password:</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                
                <label>Confirm Password:</label>
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
                
                <label>Role:</label>
                <select name="role" value={formData.role} onChange={handleChange}>
                    <option value="Donor">Donor</option>
                    <option value="NGO">NGO</option>
                </select>

                {formData.role === "NGO" && (
                    <>
                        <label>Registration Number:</label>
                        <input type="text" name="registration_number" value={formData.registration_number} onChange={handleChange} required />
                    </>
                )}

                <button type="submit">Sign Up</button>
            </form>
            <p>Already have an account? <Link to="/login">Login here</Link></p>
        </div>
    );
}
