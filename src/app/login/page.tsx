"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase";

export default function LoginPage() {
    const router = useRouter();


    const [correo, setCorreo] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [mostrarClave, setMostrarClave] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const supabase = getSupabaseClient();

        const { error } = await supabase.auth.signInWithPassword({
            email: correo,
            password: contrasena,
        });

        if (error) {
            setError("Correo o contraseña incorrectos. Verifique sus datos.");
            setLoading(false);
            return;
        }

        router.push("/");
        router.refresh();
    };

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#030712] text-white">
            <div className="absolute inset-0">
                <div className="absolute left-[-8%] top-[-10%] h-[440px] w-[440px] rounded-full bg-cyan-500/20 blur-[130px]" />
                <div className="absolute right-[-10%] top-[0%] h-[460px] w-[460px] rounded-full bg-violet-500/20 blur-[140px]" />
                <div className="absolute bottom-[-10%] left-[35%] h-[260px] w-[260px] rounded-full bg-blue-500/10 blur-[120px]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_35%)]" />
                <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:46px_46px]" />
            </div>

            <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
                <div className="relative w-full max-w-5xl animate-[fadeInUp_0.8s_ease-out]">
                    <div className="absolute -inset-2 rounded-[40px] bg-gradient-to-r from-cyan-500/20 via-blue-500/10 to-violet-500/20 blur-3xl" />

                    <div className="relative grid overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.05] shadow-[0_30px_120px_rgba(0,0,0,0.6)] backdrop-blur-2xl lg:grid-cols-2">
                        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent" />
                        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),transparent_20%,transparent_80%,rgba(255,255,255,0.03))]" />

                        <section className="relative hidden min-h-[650px] overflow-hidden lg:block">
                            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,10,28,0.92),rgba(10,14,35,0.88))]" />
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_35%)]" />
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.18),transparent_35%)]" />

                            <div className="relative z-10 flex h-full flex-col justify-between p-10">
                                <div>
                                    <div className="inline-flex items-center rounded-full border border-cyan-400/20 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-300">
                                        Control Central
                                    </div>

                                    <h1 className="mt-8 text-5xl font-black leading-tight">
                                        Bienvenido a{" "}
                                        <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                                            CIE
                                        </span>
                                    </h1>

                                    <p className="mt-5 max-w-md text-base leading-7 text-slate-300">
                                        Un acceso moderno, claro y profesional para su sistema académico.
                                    </p>
                                </div>

                                <div className="relative flex items-end justify-center">
                                    <div className="absolute h-[320px] w-[320px] rounded-full bg-cyan-500/10 blur-[90px]" />
                                    <img
                                        src="/mascota.png"
                                        alt="Mascota CIE"
                                        className="relative max-h-[390px] w-auto object-contain drop-shadow-[0_30px_80px_rgba(0,0,0,0.55)] animate-[float_5s_ease-in-out_infinite]"
                                    />
                                </div>

                                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl">
                                    <p className="text-sm text-slate-300">
                                        Plataforma académica premium para alumnos, cursos, representantes y control centralizado.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="flex min-h-[650px] items-center justify-center p-6 sm:p-10">
                            <div className="w-full max-w-md">
                                <div className="mb-8 text-center">
                                    <div className="mx-auto inline-flex rounded-3xl border border-white/10 bg-white/5 px-5 py-4 shadow-[0_12px_30px_rgba(0,0,0,0.25)] backdrop-blur-xl">
                                        <img
                                            src="/logocie.png"
                                            alt="Logo CIE"
                                            className="h-auto w-[120px] object-contain"
                                        />
                                    </div>

                                    <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.35em] text-cyan-300">
                                        Acceso seguro
                                    </p>

                                    <h2 className="mt-3 text-4xl font-black tracking-tight text-white">
                                        Iniciar sesión
                                    </h2>

                                    <p className="mt-3 text-sm leading-6 text-slate-400">
                                        Ingrese sus credenciales para continuar al sistema.
                                    </p>
                                </div>

                                <form onSubmit={handleLogin} className="space-y-5">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-300">
                                            Correo electrónico
                                        </label>
                                        <input
                                            type="email"
                                            placeholder="profesor@cie.edu"
                                            value={correo}
                                            onChange={(e) => setCorreo(e.target.value)}
                                            className="h-12 w-full rounded-2xl border border-white/10 bg-[#0b1120]/80 px-4 text-white placeholder:text-slate-500 outline-none transition duration-300 focus:border-cyan-400/50 focus:bg-[#0f172a] focus:ring-4 focus:ring-cyan-400/10"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-300">
                                            Contraseña
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={mostrarClave ? "text" : "password"}
                                                placeholder="Ingrese su contraseña"
                                                value={contrasena}
                                                onChange={(e) => setContrasena(e.target.value)}
                                                className="h-12 w-full rounded-2xl border border-white/10 bg-[#0b1120]/80 px-4 pr-12 text-white placeholder:text-slate-500 outline-none transition duration-300 focus:border-violet-400/50 focus:bg-[#0f172a] focus:ring-4 focus:ring-violet-400/10"
                                                required
                                            />

                                            <button
                                                type="button"
                                                onClick={() => setMostrarClave(!mostrarClave)}
                                                className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white"
                                            >
                                                {mostrarClave ? (
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-4 w-4"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                        strokeWidth={1.8}
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M3 3l18 18M10.584 10.587A2 2 0 0013.414 13.4M9.88 5.09A10.94 10.94 0 0112 4.91c5.05 0 9.27 3.11 10.5 7.5"
                                                        />
                                                    </svg>
                                                ) : (
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-4 w-4"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                        strokeWidth={1.8}
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7"
                                                        />
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                        />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200 animate-[fadeIn_0.25s_ease-out]">
                                            {error}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="group relative flex h-12 w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 font-semibold text-white shadow-[0_14px_35px_rgba(59,130,246,0.35)] transition duration-300 hover:scale-[1.015] hover:shadow-[0_18px_50px_rgba(139,92,246,0.35)] disabled:opacity-70"
                                    >
                                        <span className="absolute inset-0 -translate-x-full bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.24),transparent)] transition-transform duration-1000 group-hover:translate-x-full" />
                                        <span className="relative">
                                            {loading ? "Ingresando..." : "Entrar al sistema"}
                                        </span>
                                    </button>
                                </form>

                                <div className="mt-6 text-center text-xs text-slate-500">
                                    Sistema protegido · CIE Control Central
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @keyframes fadeInUp {
                    0% {
                        opacity: 0;
                        transform: translateY(26px) scale(0.98);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                @keyframes fadeIn {
                    0% {
                        opacity: 0;
                        transform: translateY(6px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes float {
                    0%, 100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-10px);
                    }
                }
            `}</style>
        </main>
    );
}