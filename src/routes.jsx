import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ProfilePage from "./pages/ProfilePage";
import EditProfile from "./pages/EditProfile";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import CampaignsPage from "./pages/CampaignsPage";
import SingleCampaignPage from "./pages/SingleCampaignPage";
import DonationPage from "./pages/DonationPage";
import EditCampaignPage from "./pages/EditCampaignPage";
import DashboardPage from "./pages/DashboardPage";
import CreateCampaignPage from "./pages/CreateCampaignPage";
import RecordsPage from "./pages/RecordsPage";
import NotificationsPage from "./pages/NotificationsPage";
import TestimonialPage from "./pages/TestimonialPage";
import CreateTestimonialPage from "./pages/CreateTestimonialPage";
import UserListPage from "./pages/UserListPage";

const routes = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            {
                path: "/",
                element: <HomePage />
            },
            {
                path: "/dashboard",
                element: <DashboardPage />
            },
            {
                path: "/records",
                element: <RecordsPage />
            },
            {
                path: "/notifications",
                element: <NotificationsPage />
            },
            {
                path: "/user-list",
                element: <UserListPage />
            },
            {
                path: "/campaigns",
                children: [
                    {
                        index: true,
                        element: <CampaignsPage />
                    },
                    {
                        path: ":id",
                        element: <SingleCampaignPage />
                    }
                ]
            },
            {
                path: "/createCampaign",
                element: <CreateCampaignPage />
            },
            {
                path: "/donate/:id",
                element: <DonationPage />
            },
            {
                path: "/edit-campaign/:id",
                element: <EditCampaignPage />
            },
            {
                path: "/testimonials",
                children: [
                    {
                        index: true,
                        element: <TestimonialPage />
                    },
                    {
                        path: "create",
                        element: <CreateTestimonialPage />
                    },
                    {
                        path: "edit/:id",
                        element: <h1>Edit Testimonial Page (Coming Soon)</h1>
                    }
                ]
            },
            {
                path: "/contact",
                element: <ContactPage />,
            },
            {
                path: "/about",
                element: <AboutPage />,
            },
            {
                path: "/profile",
                element: <ProfilePage />,
            },
            {
                path: "/login",
                element: <LoginPage />,
            },
            {
                path: "/signup",
                element: <SignUpPage />,
            },
            {
                path: "/editProfile",
                element: <EditProfile />,
            },
            {
                path: "*",
                element: <h1> 404 Not Found </h1>
            }
        ]
    },
]);

export default routes;