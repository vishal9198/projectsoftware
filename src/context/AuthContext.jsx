import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();
const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

// Debug: Log API URL on load
console.log("🌐 AuthContext initialized with API URL:", API);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check auth status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch(`${API}/api/auth/check`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        setIsAdmin(data.isAdmin || false);
      }
    } catch (err) {
      console.error("Auth check failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password, role = "user") => {
    try {
      const endpoint =
        role === "admin" ? `${API}/api/admin/login` : `${API}/api/auth/login`;
      console.log("🔐 Attempting login to:", endpoint);
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      setUser(data);
      setIsAdmin(role === "admin");
      return { success: true };
    } catch (err) {
      console.error("❌ Login error:", err.message);
      console.error("API URL being used:", API);
      return {
        success: false,
        error: err.message || "Login failed, please try again",
      };
    }
  };

  const signup = async (userData) => {
    try {
      const endpoint = `${API}/api/auth/signup`;
      console.log("📝 Attempting signup to:", endpoint);
      console.log("API URL:", API);
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(userData),
      });

      const data = await res.json();
      console.log(res.ok, data);
      if (!res.ok) {
        console.error("Signup failed with response:", data);
        // Return the backend error message directly without throwing
        return {
          success: false,
          error: data["message"] || "Signup failed, please try again",
        };
      }

      setUser(data);
      setIsAdmin(false);
      return { success: true };
    } catch (err) {
      console.error("❌ Signup error:", err.message);
      console.error("API URL being used:", API);
      return {
        success: false,
        error: err.message || "Signup failed, please try again",
      };
    }
  };

  const logout = async () => {
    try {
      const endpoint = isAdmin
        ? `${API}/api/admin/logout`
        : `${API}/api/auth/logout`;
      await fetch(endpoint, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      setIsAdmin(false);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await fetch(`${API}/api/auth/update-profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(profileData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Profile update failed");
      }

      setUser((prev) => ({ ...prev, ...data }));
      return { success: true };
    } catch (err) {
      console.error("Profile update error:", err);
      return {
        success: false,
        error: err.message || "Profile update failed, please try again",
      };
    }
  };

  const getSubmissionStats = async () => {
    try {
      // Avoid calling the backend `GET /api/problem/submissions` route
      // because the server expects a body and currently throws when
      // `req.body` is undefined. Instead, fetch solved-problem count
      // from a safe dashboard endpoint and return safe defaults for
      // the other values. This prevents crashing the backend.
      const res = await fetch(`${API}/api/dashboard/problemSolved`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      let totalSolved = 0;
      if (res.ok) {
        const data = await res.json();
        totalSolved = data.problemSolved || 0;
      } else {
        console.warn("Could not fetch problemSolved, status:", res.status);
      }

      // We don't call `/api/problem/submissions` here to avoid server-side
      // crash (it destructures `req.body`). Return safe defaults for the
      // other stats; UI can be updated later to request more detailed
      // submission info via a dedicated safe endpoint.
      return {
        success: true,
        totalSolved,
        totalSubmissions: 0,
        totalAttempted: 0,
        submissions: [],
      };
    } catch (err) {
      console.error(
        "Error fetching submission stats (frontend fallback):",
        err
      );
      return {
        success: false,
        totalSolved: 0,
        totalSubmissions: 0,
        totalAttempted: 0,
        submissions: [],
      };
    }
  };

  const getUpcomingContests = async () => {
    try {
      const res = await fetch(`${API}/api/dashboard/upcomingHackathon`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch upcoming contests");
      }

      const data = await res.json();
      return {
        success: true,
        contests: data.oa || [],
      };
    } catch (err) {
      console.error("Error fetching upcoming contests:", err);
      return {
        success: false,
        contests: [],
      };
    }
  };

  const getProblemsSolved = async () => {
    try {
      const res = await fetch(`${API}/api/dashboard/problemSolved`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch problems solved");
      }

      const data = await res.json();
      return { success: true, problemSolved: data.problemSolved || 0 };
    } catch (err) {
      console.error("Error fetching problems solved:", err);
      return { success: false, problemSolved: 0 };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        login,
        logout,
        signup,
        updateProfile,
        checkAuth,
        getSubmissionStats,
        getUpcomingContests,
        getProblemsSolved,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
