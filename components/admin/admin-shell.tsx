"use client";

import { ADMIN_NAV_ITEMS, ADMIN_RESOURCE_LABELS } from "@/components/admin/admin-config";
import { useAdminSession } from "@/components/admin/admin-context";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";
import { LayoutDashboard, LogOut, RefreshCw } from "lucide-react";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout, refreshReferenceData } = useAdminSession();

  const currentResource = useMemo(() => {
    const parts = pathname.split("/").filter(Boolean);
    return parts[1] ?? "clubs";
  }, [pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-sm text-slate-500">Chargement de l'espace admin...</p>
      </div>
    );
  }

  if (!user) {
    router.replace("/admin/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="grid lg:grid-cols-[260px_1fr] min-h-screen">
        <aside className="bg-slate-950 text-slate-200 p-4 lg:p-5 border-r border-slate-800">
          <div className="mb-7">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-md bg-slate-800 flex items-center justify-center">
                <LayoutDashboard size={16} />
              </div>
              <div>
                <p className="font-semibold text-sm">Admin Console</p>
                <p className="text-xs text-slate-400">Guinee Football Club</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-md px-3 py-2">
              <Image
                src="/images/atletico-logo.png"
                alt="Logo Atletico"
                width={36}
                height={36}
                className="h-9 w-9 object-contain"
              />
              <Image
                src="/images/jag-logo.png"
                alt="Logo JAG"
                width={36}
                height={36}
                className="h-9 w-9 object-contain"
              />
            </div>
          </div>

          <nav className="space-y-1.5">
            {ADMIN_NAV_ITEMS.map((item) => {
              const href = `/admin/${item.resource}`;
              const active = pathname === href;
              return (
                <Link
                  key={item.resource}
                  href={href}
                  className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                    active
                      ? "bg-slate-800 text-white"
                      : "text-slate-400 hover:text-white hover:bg-slate-900"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="min-h-screen">
          <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500">Administration</p>
              <h1 className="text-sm sm:text-base font-semibold text-slate-900">
                {ADMIN_RESOURCE_LABELS[currentResource as keyof typeof ADMIN_RESOURCE_LABELS] ??
                  "Dashboard"}
              </h1>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => void refreshReferenceData()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-slate-300 rounded-md hover:bg-slate-100"
              >
                <RefreshCw size={14} />
                Synchroniser
              </button>
              <div className="hidden sm:block text-right">
                <p className="text-xs text-slate-900 font-medium">{user.name}</p>
                <p className="text-[11px] text-slate-500">{user.email}</p>
              </div>
              <button
                onClick={async () => {
                  await logout();
                  router.replace("/admin/login");
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-900 text-white rounded-md hover:bg-slate-800"
              >
                <LogOut size={14} />
                Deconnexion
              </button>
            </div>
          </header>

          <main className="p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
