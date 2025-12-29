import { Link } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

export default function Navbar() {
    const { user } = useAuth();

    return (
        <div className="nav">
            <div className="nav-left">
                <Link to="/"><img src="src/images/Logo.png" alt="Logo" /></Link>
            </div>

            <nav className="nav-center">
                <Link to="/">Home</Link>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/records">Records</Link>
                <Link to="/notifications">Notifications</Link>
                <Link to="/campaigns">Campaigns</Link>
                <Link to="/testimonials">Testimonials</Link>
                <Link to="/contact">Contact</Link>
                <Link to="/about">About</Link>
            </nav>

            <div className="nav-right">
                {user ? (
                    <Link to="/profile">
                        <img src="src/images/profile.webp" alt="profile" className="profImg"/>
                    </Link>
                ) : (
                    <Link to="/login">
                        <button className="LogBut">Login</button>
                    </Link>
                )}
            </div>
        </div>
    );
}
