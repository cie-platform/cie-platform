"use client";

import { useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase";
import { useRouter, usePathname } from "next/navigation";

export default function AppShell({ children }: { children: React.ReactNode }) {
    const supabase = getSupabaseClient();
    const router = useRouter();
    const pathname = usePathname();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkSession = async () => {
            const { data } = await supabase.auth.getSession();

            // 🚫 Si NO está logueado y NO está en /login
            if (!data.session && pathname !== "/login") {
                router.push("/login");
            }

            // ✅ Si está logueado y está en login → lo sacamos
            if (data.session && pathname === "/login") {
                router.push("/");
            }

            setLoading(false);
        };

        checkSession();
    }, [pathname]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#030712] text-white">
                <p className="text-sm text-slate-400 animate-pulse">
                    Cargando sistema...
                </p>
            </div>
        );
    }

    return <>{children}</>;
}