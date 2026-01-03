import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import myNav from "../style/Navbar.module.css"; // move all navbar CSS here

export default function Navbar() {
    const { user } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => setMenuOpen(prev => !prev);

    return (
        <div className={myNav.nav}>
            <div className={myNav.navLeft}>
                <Link to="/"><img src="src/images/Logo.png" alt="Logo" /></Link>
            </div>

            <div className={`${myNav.navCenter} ${menuOpen ? myNav.active : ""}`}>
                <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
                <Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                <Link to="/records" onClick={() => setMenuOpen(false)}>Records</Link>
                <Link to="/notifications" onClick={() => setMenuOpen(false)}>Notifications</Link>
                <Link to="/campaigns" onClick={() => setMenuOpen(false)}>Campaigns</Link>
                <Link to="/testimonials" onClick={() => setMenuOpen(false)}>Testimonials</Link>
                <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
                <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
            </div>

            <div className={myNav.navRight}>
                {user ? (
                    <Link to="/profile">
                        <img src="src/images/profile.webp" alt="profile" className={myNav.profImg} />
                    </Link>
                ) : (
                    <Link to="/login">
                        <button className={myNav.LogBut}>Login</button>
                    </Link>
                )}
                <div className={myNav.hamburger} onClick={toggleMenu}>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        </div>
    );
}
