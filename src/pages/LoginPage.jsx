import { Link } from "react-router-dom";
import myLogin from "../style/LoginPage.module.css"

export default function LoginPage() {
    return (
        <div className={myLogin.login}>
            <h1> Welcome Back </h1>
            <form>
                <label> Username: </label>
                <input type="text" name="username" required />
                <br/>
                <label> Password: </label>
                <input type="password" name="password" required />
                <br/>
                <button type="submit"> Login </button>
            </form>
            <p> Don't have an account? <Link to="/signup"> Register here </Link> </p>
        </div>
    )
}