import React, { createContext, useContext, useState, useEffect } from "react";
import type { User } from "@/types";
import { authService, userService } from "@/services";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
    updateUser: (user: User) => void;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        initAuth();
    }, []);

    const initAuth = async () => {
        const token = authService.getToken();
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const userData = await userService.getProfile();
            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));
        } catch (error) {
            console.error("Failed to fetch profile:", error);
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            } else {
                authService.clearToken();
            }
        } finally {
            setLoading(false);
        }
    };

    const login = (token: string, user: User) => {
        authService.setToken(token);
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
        if (user.role === 'admin') {
            navigate('/admin/dashboard');
        } else {
            navigate('/dashboard');
        }
    };

    const logout = () => {
        authService.clearToken();
        localStorage.removeItem("user");
        setUser(null);
        navigate('/login');
    };

    const updateUser = (updatedUser: User) => {
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
    };

    const refreshProfile = async () => {
        try {
            const userData = await userService.getProfile();
            updateUser(userData);
        } catch (error) {
            console.error("Failed to refresh profile", error);
        }
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, updateUser, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
