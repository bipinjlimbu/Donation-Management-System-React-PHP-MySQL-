import {Link} from "react-router-dom"
import { useAuth } from "../components/AuthContext"

export default function () {
    const { user } = useAuth();

    return(
        <div className="nav">
            <Link to = "/"><h1> Donation Management System </h1></Link>
            <nav>
                <Link to = "/" > Home </Link>
                <Link to = "/items"> Items </Link>
                <Link to = "/contact"> Contact </Link>
                <Link to = "/about"> About </Link>
                
                {user ?
                    <Link to = "/profile"> <img src="src/images/profile.webp" alt="profile" className="profImg"/> </Link>
                    :
                    <Link to = "/login"><button className="LogBut"> Login </button></Link>
                }
            </nav>
        </div>
    )
}