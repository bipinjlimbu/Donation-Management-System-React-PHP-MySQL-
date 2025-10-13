import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ProfilePage from "./pages/ProfilePage";

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
                path:"/items",
                element:<h1> Items Page </h1>
            },
            {
                path:"/contact",
                element:<h1> Contact Page </h1>
            },
            {
                path:"/about",
                element:<h1> About Page </h1>
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
                path:"*",
                element:<h1> 404 Not Found </h1>
            }
        ]
    },
]);

export default routes;