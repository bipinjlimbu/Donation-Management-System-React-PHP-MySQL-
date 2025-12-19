import { useAuth } from "../components/AuthContext";
import AdminDashboardPage from "./AdminDashboardPage";
import DonorDashboardPage from "./DonorDashboardPage";
import LoginPage from "./LoginPage";
import NgoDashboardPage from "./NgoDashboardPage";

export default function DashboardPage() {
    const { user } = useAuth();

    if (!user) return <LoginPage />;

    switch (user.role) {
        case "Admin":
            return <AdminDashboardPage />;
        case "Donor":
            return <DonorDashboardPage />;
        case "NGO":
            return <NgoDashboardPage />;
        default:
            return <p>Invalid user role.</p>;
    }
}
