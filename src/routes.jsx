import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ProfilePage from "./pages/ProfilePage";
import EditProfile from "./pages/EditProfile";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import ItemsPage from "./pages/ItemsPage";
import CampaignsPage from "./pages/CampaignsPage";

const routes = createBrowserRouter([
    {
        path: "/",
        element:<MainLayout/>,
        children: [
            {
                path:"/",
                element:<HomePage/>
            },
            {
                path:"/campaigns",
                element:<CampaignsPage/>,
            },
            {
                path:"/contact",
                element:<ContactPage/>,
            },
            {
                path:"/about",
                element:<AboutPage/>,
            },
            {
                path:"/profile",
                element:<ProfilePage/>,
            },
            {
                path:"/login",
                element:<LoginPage/>,
            },
            {
                path:"/signup",
                element:<SignUpPage/>,
            },
            {
                path:"/editProfile",
                element:<EditProfile/>,
            },
            {
                path:"/items",
                element:<ItemsPage/>,
            },
            {
                path:"*",
                element:<h1> 404 Not Found </h1>
            }
        ]
    },
]);

export default routes;