import { useAuth } from "../components/AuthContext";
import AdminDashboardPage from "./AdminDashboardPage";
import DonorDashboardPage from "./DonorDashboardPage";
import NgoDashboardPage from "./NgoDashboardPage";
import SignUpPage from "./SignUpPage";

export default function DashboardPage() {
    const { user } = useAuth();

    if (!user) return <p>Loading user...</p>;

    switch (user.role) {
        case "Admin":
            return <AdminDashboardPage />;
        case "Donor":
            return <DonorDashboardPage />;
        case "NGO":
            return <NgoDashboardPage />;
        default:
            return <SignUpPage />;
    }
}
