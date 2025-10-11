import { useState } from "react"
import {Link} from "react-router-dom"

export default function () {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    

    return(
        <div className="nav">
            <h1> Donation Management System </h1>
            <nav>
                <Link to = "/" > Home </Link>
                <Link to = "/items"> Items </Link>
                <Link to = "/contact"> Contact </Link>
                <Link to = "/about"> About </Link>
                
                {isLoggedIn ?
                    <Link to = "/profile"> <button className="ProBut"> Profile </button> </Link>
                    :
                    <button onClick={() => setIsLoggedIn(true)} className="LogBut"> Login </button>
                }
            </nav>
        </div>
    )
}