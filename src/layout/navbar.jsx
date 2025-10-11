import {Link} from "react-router-dom"

export default function () {
    return(
        <div className="nav">
            <h1> Donation Management System </h1>
            <nav>
                <Link to = "/" > Home </Link>
                <Link to = "/items"> Items </Link>
                <Link to = "/contact"> Contact </Link>
                <Link to = "/about"> About </Link>
                <button> Login </button>
            </nav>
        </div>
    )
}