import { Link } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

export default function Navbar() {
    const { user } = useAuth();

    return (
        <div className="nav">
            <Link to="/"><h1>ShareHope</h1></Link>
            <nav>
                <Link to="/">Home</Link>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/records">Records</Link>
                <Link to="/campaigns">Campaigns</Link>
                <Link to="/contact">Contact</Link>
                <Link to="/about">About</Link>

                {user ? (
                    <Link to="/profile">
                        <img src="src/images/profile.webp" alt="profile" className="profImg"/>
                    </Link>
                ) : (
                    <Link to="/login">
                        <button className="LogBut">Login</button>
                    </Link>
                )}
            </nav>
        </div>
    )
}
