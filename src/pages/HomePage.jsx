import myHome from "../style/HomePage.module.css"
import { Link } from "react-router-dom";

export default function HomePage() {
    return (
        <div className={myHome.home}>
            <h1> Welcome to Donation Management System </h1>
            <p> This is a platform where you can manage your donations effectively. You can view items, contact us, learn about us, and manage your profile. Please log in to access your profile and other features. </p>
            <Link to = "/login"><button className={myHome.but}> Join Us </button></Link>
        </div>
    )
}