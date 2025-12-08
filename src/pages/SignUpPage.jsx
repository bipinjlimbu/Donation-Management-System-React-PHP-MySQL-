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

    const [verificationFile, setVerificationFile] = useState(null);
    const navigate = useNavigate();

    const handleChange = e =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleFileChange = e => setVerificationFile(e.target.files[0]);

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const form = new FormData();
            Object.keys(formData).forEach(k => form.append(k, formData[k]));
            if (verificationFile) form.append("verification_file", verificationFile);

            const res = await axios.post("http://localhost/dms/api/signup.php", form);
            if (res.data.success) navigate("/login");
            else alert(res.data.message);
        } catch (err) {
            alert("Error");
        }
    };

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.card}>
                <h2 className={styles.title}>Create an Account</h2>

                <form onSubmit={handleSubmit}>

                    <label className={styles.label}> 
                        {formData.role === "NGO" ? "Organization Name" : "Full Name"}
                    </label>
                    <input type="text" name="name" className={styles.input}
                        onChange={handleChange} />

                    <label className={styles.label}>Email Address</label>
                    <input type="email" name="email" className={styles.input}
                        onChange={handleChange} />

                    <label className={styles.label}>Password</label>
                    <input type="password" name="password" className={styles.input}
                        onChange={handleChange} />

                    <label className={styles.label}>Confirm Password</label>
                    <input type="password" name="confirmPassword" className={styles.input}
                        onChange={handleChange} />

                    <label className={styles.label}>Role</label>
                    <select name="role" className={styles.input} onChange={handleChange}>
                        <option value="Donor">Donor</option>
                        <option value="NGO">NGO</option>
                    </select>

                    <label className={styles.label}>Phone</label>
                    <input type="text" name="phone" className={styles.input}
                        onChange={handleChange} />

                    <label className={styles.label}>Address</label>
                    <textarea name="address" className={styles.textarea}
                        onChange={handleChange}></textarea>

                    {formData.role === "NGO" && (
                        <>
                            <label className={styles.label}>Registration Number</label>
                            <input type="text" name="registration_number" className={styles.input}
                                onChange={handleChange} />

                            <label className={styles.label}>Verification File</label>
                            <input type="file" className={styles.file}
                                onChange={handleFileChange} />
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
