import { Link } from "react-router-dom";
import myLogin from "../style/LSPage.module.css"
import Footer from "../layout/Footer";
import { useAuth } from "../components/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginPage() {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "email") {
            setEmail(value);
        } else if (name === "password") {
            setPassword(value);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await axios.post("http://localhost/dms/api/login.php", { email, password })
        if (response.data.success){
            login(response.data.user);
            navigate("/");
        } else {
            alert("Login failed: " + response.data.message);
        }
    }
        

    return (
        <div className={myLogin.login}>
            <h1> Welcome Back </h1>
            <form onSubmit={handleSubmit}>
                <label> Email: </label>
                <input type="email" name="email" onChange={handleChange} required />
                <br/>
                <label> Password: </label>
                <input type="password" name="password" onChange={handleChange} required />
                <br/>
                <button type="submit"> Login </button>
            </form>
            <p> Don't have an account? <Link to="/signup"> Register here </Link> </p>
            <Footer/>
        </div>
    )
}