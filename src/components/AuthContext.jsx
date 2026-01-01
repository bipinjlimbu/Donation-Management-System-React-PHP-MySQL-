import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost/dms/api/checkAuth.php", { credentials: "include" })
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data?.authenticated) setUser(data.user);
                else setUser(null);
            })
            .finally(() => setLoading(false));
    }, []);

    const login = (userData) => setUser(userData);

    const logout = async () => {
        await fetch("http://localhost/dms/api/logout.php", { credentials: "include" });
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
