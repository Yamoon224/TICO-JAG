"use client";

import { useAdminSession } from "@/components/admin/admin-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, login, loading } = useAdminSession();
  const [email, setEmail] = useState("admin@guinee-football.local");
  const [password, setPassword] = useState("admin1234");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      router.replace("/admin/clubs");
    }
  }, [user]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError("");

    try {
      await login(email, password);
      router.replace("/admin/clubs");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connexion impossible.");
    } finally {
      setPending(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-sm text-slate-500">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h1 className="text-xl font-bold text-slate-900 mb-1">Connexion admin</h1>
        <p className="text-sm text-slate-500 mb-6">Accede a l'espace de gestion metier</p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 text-white py-2 rounded-md text-sm font-semibold disabled:opacity-60"
            disabled={pending}
          >
            {pending ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        {error && <p className="mt-3 text-xs text-red-600">{error}</p>}
      </div>
    </div>
  );
}
