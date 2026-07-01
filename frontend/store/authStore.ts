import { create } from "zustand";

interface AuthState {
  token: string | null;
  username: string | null;
  roles: string[];
  isAuthenticated: boolean;
  login: (token: string, username: string, roles: string[]) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  // Safe SSR checking for window environment
  const isClient = typeof window !== "undefined";
  
  const getInitialToken = () => (isClient ? localStorage.getItem("auth_token") : null);
  const getInitialUsername = () => (isClient ? localStorage.getItem("auth_username") : null);
  const getInitialRoles = () => {
    if (!isClient) return [];
    const rolesRaw = localStorage.getItem("auth_roles");
    try {
      return rolesRaw ? JSON.parse(rolesRaw) : [];
    } catch {
      return [];
    }
  };

  return {
    token: getInitialToken(),
    username: getInitialUsername(),
    roles: getInitialRoles(),
    isAuthenticated: !!(isClient ? localStorage.getItem("auth_token") : null),

    login: (token, username, roles) => {
      if (isClient) {
        localStorage.setItem("auth_token", token);
        localStorage.setItem("auth_username", username);
        localStorage.setItem("auth_roles", JSON.stringify(roles));
      }
      set({
        token,
        username,
        roles,
        isAuthenticated: true,
      });
    },

    logout: () => {
      if (isClient) {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_username");
        localStorage.removeItem("auth_roles");
      }
      set({
        token: null,
        username: null,
        roles: [],
        isAuthenticated: false,
      });
    },
  };
});
