import "../index.css";
import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footerContainer">

                <div className="footerColumn">
                    <h3>ShareHope</h3>
                    <p>Bridging the gap between donors and NGOs. Donate with purpose and make a difference.</p>
                </div>

                <div className="footerColumn">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/campaigns">Campaigns</Link></li>
                        <li><Link to="/signup">Sign Up</Link></li>
                        <li><Link to="/login">Login</Link></li>
                    </ul>
                </div>

                <div className="footerColumn">
                    <h4>Contact</h4>
                    <p>Email: support@sharehope.com</p>
                    <p>Phone: +123 456 7890</p>
                    <p>Address: 123 Donation Street, City, Country</p>
                </div>

=                <div className="footerColumn">
                    <h4>Follow Us</h4>
                    <div className="socialLinks">
                        <a href="#" target="_blank" rel="noreferrer">🌐</a>
                        <a href="#" target="_blank" rel="noreferrer">🐦</a>
                        <a href="#" target="_blank" rel="noreferrer">📘</a>
                        <a href="#" target="_blank" rel="noreferrer">📸</a>
                    </div>
                </div>

            </div>

            <div className="footerBottom">
                <p>© {new Date().getFullYear()} ShareHope. All Rights Reserved.</p>
            </div>
        </footer>
    );
}
