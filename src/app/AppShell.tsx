'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import {
    LayoutDashboard,
    Users,
    BookOpen,
    Settings,
    LogOut,
    Search,
    Bell,
    Sparkles,
    Shield,
} from 'lucide-react'

const navItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/alumnos', label: 'Alumnos', icon: Users },
    { href: '/cursos', label: 'Cursos', icon: BookOpen },
    { href: '/ajustes', label: 'Ajustes', icon: Settings },
]

export default function AppShell({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const pathname = usePathname()

    const [userEmail, setUserEmail] = useState('')
    const [loadingSession, setLoadingSession] = useState(true)

    useEffect(() => {
        async function checkSession() {
            const {
                data: { session },
            } = await supabase.auth.getSession()

            if (!session && pathname !== '/login') {
                router.push('/login')
                setLoadingSession(false)
                return
            }

            if (session?.user) {
                setUserEmail(session.user.email || '')
            }

            if (session && pathname === '/login') {
                router.push('/')
            }

            setLoadingSession(false)
        }

        checkSession()

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session) {
                setUserEmail('')
                if (pathname !== '/login') router.push('/login')
            } else {
                setUserEmail(session.user.email || '')
                if (pathname === '/login') router.push('/')
            }
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [pathname, router])

    async function handleLogout() {
        await supabase.auth.signOut()
        router.push('/login')
    }

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
        )
    }

    const isLoginPage = pathname === '/login'

    if (isLoginPage) {
        return <>{children}</>
    }

    return (
        <div className="relative flex min-h-screen">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute left-10 top-20 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
                <div className="absolute right-10 top-0 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
                <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-sky-500/10 blur-3xl" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:38px_38px] opacity-[0.05]" />
            </div>

            <aside className="relative z-20 hidden w-72 shrink-0 border-r border-cyan-400/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.92),rgba(9,14,35,0.96))] backdrop-blur-2xl shadow-[inset_-1px_0_0_rgba(255,255,255,0.04)] xl:flex xl:flex-col">
                <div className="border-b border-white/10 px-6 py-6">
                    <div className="flex items-center gap-4">
                        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/30 bg-gradient-to-br from-cyan-400/30 via-blue-500/20 to-violet-500/25 shadow-[0_10px_40px_rgba(34,211,238,0.22)]">
                            <span className="relative bg-gradient-to-b from-white to-cyan-200 bg-clip-text text-2xl font-black tracking-tight text-transparent">
                                C
                            </span>
                        </div>

                        <div>
                            <div className="text-2xl font-black tracking-[0.18em] text-white">
                                CIE
                            </div>
                            <div className="mt-1 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-300/80">
                                <Sparkles size={12} />
                                Control Central
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-1 flex-col px-4 py-6">
                    <div className="mb-4 px-3 text-[11px] font-bold uppercase tracking-[0.3em] text-slate-500">
                        Navegación
                    </div>

                    <nav className="space-y-2">
                        {navItems.map((item) => {
                            const Icon = item.icon

                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className="group relative flex items-center gap-3 overflow-hidden rounded-2xl border border-transparent px-4 py-3.5 text-slate-300 transition-all duration-300 hover:border-cyan-300/20 hover:bg-white/5 hover:text-white"
                                >
                                    <div className="rounded-xl bg-white/5 p-2 text-slate-400 transition-all duration-300 group-hover:bg-cyan-400/10 group-hover:text-cyan-300">
                                        <Icon size={18} />
                                    </div>

                                    <span className="font-semibold tracking-wide">
                                        {item.label}
                                    </span>
                                </Link>
                            )
                        })}
                    </nav>

                    <div className="mt-8 rounded-[28px] border border-cyan-400/15 bg-gradient-to-br from-cyan-400/10 via-sky-500/5 to-violet-500/10 p-5 shadow-[0_0_35px_rgba(34,211,238,0.08)]">
                        <div className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-300/70">
                            Estado del sistema
                        </div>
                        <h3 className="mt-3 text-xl font-bold text-white">
                            Núcleo CIE activo
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-slate-300">
                            Sincronización estable, monitoreo en tiempo real y operación
                            académica online.
                        </p>

                        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-sm font-medium text-emerald-300">
                            <Shield size={16} />
                            Todo estable
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 p-4">
                    <button
                        onClick={handleLogout}
                        className="group relative flex w-full items-center gap-3 overflow-hidden rounded-2xl border border-red-500/10 bg-red-500/5 px-4 py-3 text-slate-300 transition-all duration-300 hover:scale-[1.01] hover:border-red-400/25 hover:bg-red-500/10 hover:text-white"
                    >
                        <span className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
                            <span className="absolute inset-0 bg-red-500/5 blur-xl" />
                        </span>

                        <div className="relative z-10 rounded-xl bg-red-500/10 p-2 text-red-300 transition-all duration-300 group-hover:scale-110 group-hover:bg-red-500/15">
                            <LogOut size={18} />
                        </div>

                        <span className="relative z-10 font-semibold tracking-wide">
                            Cerrar sesión
                        </span>
                    </button>
                </div>
            </aside>

            <main className="relative z-10 flex min-h-screen flex-1 flex-col">
                <header className="sticky top-0 z-30 border-b border-cyan-400/10 bg-[linear-gradient(180deg,rgba(3,7,18,0.88),rgba(5,8,22,0.72))] backdrop-blur-2xl">
                    <div className="flex flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between xl:px-8">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300/70">
                                Ecosistema CIE
                            </p>
                            <h1 className="mt-1 text-2xl font-black tracking-tight text-white md:text-3xl">
                                Panel de Control Futurista
                            </h1>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <div className="relative w-full sm:w-[380px]">
                                <Search
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                                    size={18}
                                />
                                <input
                                    type="search"
                                    placeholder="Buscar dentro del sistema CIE..."
                                    className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-12 pr-4 text-sm text-white outline-none transition-all duration-300 placeholder:text-slate-500 focus:border-cyan-400/40 focus:bg-white/10 focus:shadow-[0_0_0_4px_rgba(34,211,238,0.08)]"
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <button className="group relative rounded-2xl border border-white/10 bg-white/5 p-3 text-slate-300 transition-all duration-300 hover:scale-105 hover:border-cyan-400/40 hover:bg-cyan-400/10 hover:text-cyan-300">
                                    <Bell
                                        size={20}
                                        className="relative z-10 transition-transform duration-300 group-hover:rotate-6"
                                    />
                                    <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_14px_rgba(34,211,238,1)]" />
                                    <span className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition group-hover:opacity-100">
                                        <span className="absolute inset-0 bg-cyan-400/10 blur-xl"></span>
                                    </span>
                                </button>

                                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5">
                                    <img
                                        src="https://api.dicebear.com/8.x/bottts/svg?seed=CIE-PRO"
                                        alt="Admin"
                                        className="h-11 w-11 rounded-full border border-cyan-400/30 bg-black/20"
                                    />
                                    <div className="hidden sm:block">
                                        <p className="text-sm font-bold text-white">
                                            {userEmail ? userEmail.split('@')[0] : 'Usuario CIE'}
                                        </p>
                                        <p className="text-xs font-medium text-cyan-300">
                                            {userEmail || 'Sesión activa'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <section className="flex-1 px-6 py-6 xl:px-8">
                    <div className="mx-auto w-full max-w-[1600px]">{children}</div>
                </section>
            </main>
        </div>
    )
}