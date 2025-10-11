import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import HomePage from "./pages/HomePage";

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
                element:<h1> Profile Page </h1>
            },
            {
                path:"/login",
                element:<h1> Login Page </h1>
            },
            {
                path:"*",
                element:<h1> 404 Not Found </h1>
            }
        ]
    },
]);

export default routes;