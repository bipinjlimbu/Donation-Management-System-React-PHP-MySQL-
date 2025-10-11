import { useState } from "react"
import {Link} from "react-router-dom"

export default function () {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    

    return(
        <div className="nav">
            <Link to = "/"><h1> Donation Management System </h1></Link>
            <nav>
                <Link to = "/" > Home </Link>
                <Link to = "/items"> Items </Link>
                <Link to = "/contact"> Contact </Link>
                <Link to = "/about"> About </Link>
                
                {isLoggedIn ?
                    <Link to = "/profile"> <button className="ProBut"> Profile </button> </Link>
                    :
                    <Link to = "/login"><button className="LogBut"> Login </button></Link>
                }
            </nav>
        </div>
    )
}