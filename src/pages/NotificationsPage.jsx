import { useAuth } from "../components/AuthContext";
import LoginPage from "./LoginPage";

export default function NotificationsPage() {
    const { user } = useAuth();

    if (!user) return <LoginPage />;

    else{
        return (
            <div>
                <h1>Notifications Page - Coming Soon!</h1>
            </div>
        );
    }
}