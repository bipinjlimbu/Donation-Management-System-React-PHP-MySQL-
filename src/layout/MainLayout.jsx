import { Outlet } from "react-router-dom";
import Navbar from "./navbar";
import Footer from "./Footer";

export default function MainLayout() {
    return (
        <>
            <Navbar/>
            <main>
                <Outlet/>
            </main>   
        </>
    )
}