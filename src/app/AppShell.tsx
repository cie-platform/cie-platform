"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase";

export default function AppShell({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const supabase = getSupabaseClient();

    const [loadingSession, setLoadingSession] = useState(true);

    useEffect(() => {
        async function checkSession() {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!session && pathname !== "/login") {
                router.push("/login");
                setLoadingSession(false);
                return;
            }

            if (session && pathname === "/login") {
                router.push("/");
            }

            setLoadingSession(false);
        }

        checkSession();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session) {
                if (pathname !== "/login") router.push("/login");
            } else {
                if (pathname === "/login") router.push("/");
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [pathname, router, supabase]);

    if (loadingSession) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#020617] text-white">
                <div className="text-center">
                    <p className="text-sm uppercase tracking-[0.25em] text-cyan-300/70">
                        CIE
                    </p>
                    <h2 className="mt-3 text-2xl font-bold text-white">
                        Cargando sistema...
                    </h2>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}