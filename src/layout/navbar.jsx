import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import myNav from "../style/Navbar.module.css";

export default function Navbar() {
    const { user } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => setMenuOpen(prev => !prev);

    const closeMenu = () => setMenuOpen(false);

    return (
        <div className={myNav.nav}>
            <div className={myNav.navLeft}>
                <Link to="/"><img src="src/images/Logo.png" alt="Logo" /></Link>
            </div>

            <div className={`${myNav.navCenter} ${menuOpen ? myNav.active : ""}`}>
                <Link to="/" onClick={closeMenu}>Home</Link>
                <Link to="/dashboard" onClick={closeMenu}>Dashboard</Link>
                <Link to="/campaigns" onClick={closeMenu}>Campaigns</Link>

                {user?.role === "Admin" && (
                    <Link to="/user-list" onClick={closeMenu}>User List</Link>
                )}

                {(user?.role === "Donor" || user?.role === "NGO") && (
                    <Link to="/notifications" onClick={closeMenu}>Notifications</Link>
                )}

                <Link to="/records" onClick={closeMenu}>Records</Link>
                <Link to="/testimonials" onClick={closeMenu}>Testimonials</Link>
                <Link to="/about" onClick={closeMenu}>About</Link>
                <Link to="/contact" onClick={closeMenu}>Contact</Link>
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