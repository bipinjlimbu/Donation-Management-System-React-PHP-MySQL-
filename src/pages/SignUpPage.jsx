import { Link } from "react-router-dom";
import myLogin from "../style/LSPage.module.css"
import Footer from "../layout/Footer";

export default function SignUpPage() {
    return (
        <div className={myLogin.login}>
            <h1> Join Us </h1>
            <form>
                <label> Email: </label>
                <input type="email" name="email" required />
                <br/>
                <label> Password: </label>
                <input type="password" name="password" required />
                <br/>
                <label> Confirm Password: </label>
                <input type="password" name="confirmPassword" required />
                <br/>
                <button type="submit"> Sign Up </button>
            </form>
            <p> Already Have an Account? <Link to="/login"> Login here </Link> </p>
            <Footer/>
        </div>
    )
}