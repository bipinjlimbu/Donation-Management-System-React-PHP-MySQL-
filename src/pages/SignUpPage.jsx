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
        name: "",
        phone: "",
        address: "",
        registration_number: ""
    });

    const [verificationFile, setVerificationFile] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setVerificationFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email.trim() || !formData.password.trim() || !formData.name.trim()) {
            alert("All required fields are mandatory!");
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

        if (formData.role === "NGO") {
            if (!formData.registration_number.trim()) {
                alert("Registration number is required for NGOs!");
                return;
            }
            if (!verificationFile) {
                alert("Please upload verification file!");
                return;
            }
        }

        try {
            const form = new FormData();
            form.append("email", formData.email.trim());
            form.append("password", formData.password.trim());
            form.append("role", formData.role);
            form.append("name", formData.name.trim());
            form.append("phone", formData.phone.trim());
            form.append("address", formData.address.trim());
            form.append("registration_number", formData.registration_number.trim());
            if (verificationFile) form.append("verification_file", verificationFile);

            const response = await axios.post("http://localhost/dms/api/signup.php",
                form,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

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

                {formData.role === "Donor" && (
                    <>
                        <label>Full Name:</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required />

                        <label>Phone:</label>
                        <input type="text" name="phone" value={formData.phone} onChange={handleChange} />

                        <label>Address:</label>
                        <textarea name="address" value={formData.address} onChange={handleChange} />
                    </>
                )}

                {formData.role === "NGO" && (
                    <>
                        <label>Organization Name:</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required />

                        <label>Phone:</label>
                        <input type="text" name="phone" value={formData.phone} onChange={handleChange} />

                        <label>Address:</label>
                        <textarea name="address" value={formData.address} onChange={handleChange} />

                        <label>Registration Number:</label>
                        <input type="text" name="registration_number" value={formData.registration_number} onChange={handleChange} required />

                        <label>Upload Verification Document:</label>
                        <input type="file" onChange={handleFileChange} accept=".pdf,.jpg,.png" required />
                    </>
                )}

                <button type="submit">Sign Up</button>
            </form>

            <p>Already have an account? <Link to="/login">Login here</Link></p>
        </div>
    );
}
