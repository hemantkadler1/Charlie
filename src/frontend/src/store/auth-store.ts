import { MOCK_USERS } from "@/lib/mock-data";
import type { User, UserRole } from "@/lib/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (role: UserRole, name?: string) => boolean;
  loginWithCredentials: (username: string, password: string) => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (role: UserRole, name?: string) => {
        const mockUser = MOCK_USERS.find((u) => u.role === role);
        if (mockUser) {
          set({
            user: name ? { ...mockUser, name } : mockUser,
            isAuthenticated: true,
          });
          return true;
        }
        return false;
      },
      loginWithCredentials: (username: string, password: string) => {
        if (username === "superadmin" && password === "superadmin123") {
          const superAdminUser = MOCK_USERS.find(
            (u) => u.role === "superAdmin",
          );
          if (superAdminUser) {
            set({ user: superAdminUser, isAuthenticated: true });
            return true;
          }
        }
        return false;
      },
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: "medicore-auth" },
  ),
);
