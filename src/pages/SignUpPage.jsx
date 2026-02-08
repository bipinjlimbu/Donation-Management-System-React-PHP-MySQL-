import { Link } from "react-router-dom";
import styles from "../style/SignUpPage.module.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

    const [errors, setErrors] = useState({});
    const [verificationFile, setVerificationFile] = useState(null);
    const navigate = useNavigate();

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: "" });
        }
    };

    const handleFileChange = e => {
        setVerificationFile(e.target.files[0]);
        setErrors({ ...errors, verification_file: "" });
    };

    const validate = () => {
        let newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!emailRegex.test(formData.email)) newErrors.email = "Invalid email format";

        if (!passwordRegex.test(formData.password)) {
            newErrors.password = "Password must be 8+ chars with uppercase, lowercase, and a number";
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        if (formData.phone.length < 10) newErrors.phone = "Enter a valid phone number";
        if (!formData.address.trim()) newErrors.address = "Address is required";

        if (formData.role === "NGO") {
            if (!formData.registration_number.trim()) newErrors.registration_number = "Registration is required";
            if (!verificationFile) newErrors.verification_file = "Please upload a document";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async e => {
        e.preventDefault();

        if (!validate()) return;

        try {
            const form = new FormData();
            Object.keys(formData).forEach(k => form.append(k, formData[k]));
            if (verificationFile) form.append("verification_file", verificationFile);

            const res = await axios.post("http://localhost/dms/api/signup.php", form);
            if (res.data.success) navigate("/login");
            else alert(res.data.message);
        } catch (err) {
            alert("Error connecting to server");
        }
    };

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.card}>
                <h2 className={styles.title}>Create an Account</h2>

                <form onSubmit={handleSubmit} noValidate>
                    <label className={styles.label}>
                        {formData.role === "NGO" ? "Organization Name" : "Full Name"}
                    </label>
                    <input type="text" name="name" className={styles.input} onChange={handleChange} />
                    {errors.name && <p className={styles.errorText}>{errors.name}</p>}

                    <label className={styles.label}>Email Address</label>
                    <input type="email" name="email" className={styles.input} onChange={handleChange} />
                    {errors.email && <p className={styles.errorText}>{errors.email}</p>}

                    <label className={styles.label}>Password</label>
                    <input type="password" name="password" className={styles.input} onChange={handleChange} />
                    {errors.password && <p className={styles.errorText}>{errors.password}</p>}

                    <label className={styles.label}>Confirm Password</label>
                    <input type="password" name="confirmPassword" className={styles.input} onChange={handleChange} />
                    {errors.confirmPassword && <p className={styles.errorText}>{errors.confirmPassword}</p>}

                    <label className={styles.label}>Role</label>
                    <select name="role" className={styles.input} onChange={handleChange}>
                        <option value="Donor">Donor</option>
                        <option value="NGO">NGO</option>
                    </select>

                    <label className={styles.label}>Phone</label>
                    <input type="text" name="phone" className={styles.input} onChange={handleChange} />
                    {errors.phone && <p className={styles.errorText}>{errors.phone}</p>}

                    <label className={styles.label}>Address</label>
                    <textarea name="address" className={styles.textarea} onChange={handleChange}></textarea>
                    {errors.address && <p className={styles.errorText}>{errors.address}</p>}

                    {formData.role === "NGO" && (
                        <>
                            <label className={styles.label}>Registration Number</label>
                            <input type="text" name="registration_number" className={styles.input} onChange={handleChange} />
                            {errors.registration_number && <p className={styles.errorText}>{errors.registration_number}</p>}

                            <label className={styles.label}>Verification File</label>
                            <input type="file" className={styles.file} onChange={handleFileChange} />
                            {errors.verification_file && <p className={styles.errorText}>{errors.verification_file}</p>}
                        </>
                    )}

                    <button type="submit" className={styles.button}>Register</button>
                </form>

                <p className={styles.footerText}>
                    Already have an account? <Link to="/login">Sign In</Link>
                </p>
            </div>
        </div>
    );
}