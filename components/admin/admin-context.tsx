"use client";

import {
  adminLogin,
  adminLogout,
  adminMe,
  fetchClubsWithTeams,
  type AdminUser,
  type ClubApiModel,
} from "@/lib/api";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

type AdminContextValue = {
  token: string;
  user: AdminUser | null;
  loading: boolean;
  clubsWithTeams: ClubApiModel[];
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshReferenceData: () => Promise<void>;
};

const AdminContext = createContext<AdminContextValue | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState("");
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [clubsWithTeams, setClubsWithTeams] = useState<ClubApiModel[]>([]);

  useEffect(() => {
    const storedToken = localStorage.getItem("admin_token");
    if (!storedToken) {
      setLoading(false);
      return;
    }

    void restore(storedToken);
  }, []);

  async function restore(storedToken: string) {
    try {
      setLoading(true);
      const currentUser = await adminMe(storedToken);
      const clubs = await fetchClubsWithTeams();
      setToken(storedToken);
      setUser(currentUser);
      setClubsWithTeams(clubs);
    } catch {
      localStorage.removeItem("admin_token");
      setToken("");
      setUser(null);
      setClubsWithTeams([]);
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string) {
    const auth = await adminLogin(email, password);
    localStorage.setItem("admin_token", auth.token);
    setToken(auth.token);
    setUser(auth.user);
    const clubs = await fetchClubsWithTeams();
    setClubsWithTeams(clubs);
  }

  async function logout() {
    if (token) {
      try {
        await adminLogout(token);
      } catch {
        // ignore API logout failure and clear local session.
      }
    }

    localStorage.removeItem("admin_token");
    setToken("");
    setUser(null);
    setClubsWithTeams([]);
  }

  async function refreshReferenceData() {
    const clubs = await fetchClubsWithTeams();
    setClubsWithTeams(clubs);
  }

  const value = useMemo(
    () => ({ token, user, loading, clubsWithTeams, login, logout, refreshReferenceData }),
    [token, user, loading, clubsWithTeams]
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdminSession() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdminSession must be used inside AdminProvider");
  }
  return context;
}
