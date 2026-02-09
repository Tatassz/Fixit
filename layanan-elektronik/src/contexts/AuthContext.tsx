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
    console.log("🔄 AuthContext: useEffect triggered, calling initAuth()");
    initAuth();
  }, []);

  const initAuth = async () => {
    console.log("🚀 AuthContext: initAuth() started");

    const token = authService.getToken();
    const storedUser = localStorage.getItem("user");

    console.log("📦 AuthContext: Token exists?", !!token);
    console.log("📦 AuthContext: Stored user exists?", !!storedUser);

    if (!token) {
      console.log("❌ AuthContext: No token found, setting loading = false");
      setLoading(false);
      return;
    }

    // ✅ If we have both token and stored user, use them immediately
    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log(
          "✅ AuthContext: Using stored user immediately:",
          parsedUser.email,
        );
        setUser(parsedUser);

        console.log("⏳ AuthContext: Setting loading = false (user available)");
        setLoading(false);

        // ✅ Try to refresh profile in background (don't block UI)
        console.log("🔄 AuthContext: Refreshing profile in background...");
        userService
          .getProfile()
          .then((userData) => {
            console.log(
              "✅ AuthContext: Profile refreshed successfully:",
              userData.email,
            );
            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));
          })
          .catch((error) => {
            console.error("⚠️ AuthContext: Failed to refresh profile:", error);
            // Keep using stored user if refresh fails
          });
      } catch (error) {
        console.error("❌ AuthContext: Failed to parse stored user:", error);
        authService.clearToken();
        localStorage.removeItem("user");
        setLoading(false);
      }
    } else {
      // ✅ No stored user, try to fetch profile
      console.log("🔍 AuthContext: No stored user, fetching profile...");
      try {
        const userData = await userService.getProfile();
        console.log("✅ AuthContext: Profile fetched:", userData.email);
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      } catch (error) {
        console.error("❌ AuthContext: Failed to fetch profile:", error);
        authService.clearToken();
        localStorage.removeItem("user");
      } finally {
        console.log("⏳ AuthContext: Setting loading = false");
        setLoading(false);
      }
    }
  };

  const login = (token: string, user: User) => {
    console.log("🔐 AuthContext: login() called for:", user.email);

    // ✅ Set token FIRST before setting state
    console.log("📝 AuthContext: Setting token in authService...");
    authService.setToken(token);

    console.log("📝 AuthContext: Saving user to localStorage...");
    localStorage.setItem("user", JSON.stringify(user));

    // ✅ Then update state
    console.log("📝 AuthContext: Updating user state...");
    setUser(user);

    // ✅ Set loading to false immediately after setting user
    setLoading(false);

    // ✅ Navigate in next tick to ensure state is updated
    const destination =
      user.role === "admin" ? "/admin/dashboard" : "/dashboard";
    console.log("🧭 AuthContext: Navigating to:", destination);

    // Use setTimeout to defer navigation until after state updates
    setTimeout(() => {
      navigate(destination);
    }, 0);
  };

  const logout = () => {
    console.log("🚪 AuthContext: logout() called");
    authService.clearToken();
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const updateUser = (updatedUser: User) => {
    console.log("📝 AuthContext: updateUser() called");
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const refreshProfile = async () => {
    console.log("🔄 AuthContext: refreshProfile() called");
    try {
      const userData = await userService.getProfile();
      console.log("✅ AuthContext: refreshProfile() success");
      updateUser(userData);
    } catch (error) {
      console.error("❌ AuthContext: refreshProfile() failed:", error);
    }
  };

  console.log(
    "🎨 AuthContext: Rendering - user:",
    user?.email || "null",
    "loading:",
    loading,
  );

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, updateUser, refreshProfile }}
    >
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
