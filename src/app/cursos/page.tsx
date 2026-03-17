'use client'

import Link from 'next/link'
import {
    Users,
    BookOpen,
    GraduationCap,
    DollarSign,
    TrendingUp,
    BellDot,
    CalendarDays,
    ArrowUpRight,
    Activity,
    ShieldCheck,
    Cpu,
    Sparkles,
} from 'lucide-react'

const stats = [
    {
        label: 'Total Alumnos',
        value: '1,452',
        icon: Users,
        accent: 'from-cyan-400/20 to-sky-500/20',
        iconColor: 'text-cyan-300',
        trend: '+12%',
        detail: 'este mes',
    },
    {
        label: 'Cursos Activos',
        value: '38',
        icon: BookOpen,
        accent: 'from-violet-400/20 to-fuchsia-500/20',
        iconColor: 'text-violet-300',
        trend: '+2',
        detail: 'nuevos cursos',
    },
    {
        label: 'Graduados',
        value: '7,890',
        icon: GraduationCap,
        accent: 'from-emerald-400/20 to-teal-500/20',
        iconColor: 'text-emerald-300',
        trend: '+18%',
        detail: 'avance anual',
    },
    {
        label: 'Ingresos',
        value: '$12.5k',
        icon: DollarSign,
        accent: 'from-amber-400/20 to-orange-500/20',
        iconColor: 'text-amber-300',
        trend: '+8%',
        detail: 'vs mes anterior',
    },
]

const activity = [
    '12 nuevos alumnos registrados en el sistema.',
    'Se activó el curso “Inglés Intensivo B2”.',
    '3 pagos pendientes detectados por facturación.',
    'Docente asignado al módulo de Matemática Avanzada.',
]

const monthlyData = [42, 58, 67, 49, 84, 91, 76]

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            <section className="relative overflow-hidden rounded-[34px] border border-white/10 bg-white/5 p-8 shadow-[0_0_60px_rgba(0,0,0,0.25)] backdrop-blur-2xl lg:p-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.18),transparent_28%)]" />
                <div className="absolute -top-16 right-0 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />
                <div className="absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl" />

                <div className="relative z-10 flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
                    <div className="max-w-3xl" style={{ animation: 'fadeUp 0.7s ease both' }}>
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-300">
                            <Sparkles size={16} />
                            Interfaz CIE Neural System
                        </div>

                        <h2 className="text-4xl font-black tracking-tight text-white md:text-5xl">
                            Bienvenido, Sabri.
                            <span className="block bg-gradient-to-r from-cyan-300 via-sky-400 to-violet-400 bg-clip-text text-transparent">
                                Tu plataforma ahora tiene vida.
                            </span>
                        </h2>

                        <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">
                            Supervisa alumnos, cursos, ingresos y actividad académica desde
                            una interfaz premium diseñada para transmitir innovación, control
                            y potencia visual.
                        </p>

                        <div className="mt-6 flex flex-wrap gap-3">
                            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-300">
                                <ShieldCheck size={16} />
                                Sistema estable
                            </span>
                            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-300">
                                <BellDot size={16} />
                                3 alertas activas
                            </span>
                            <span className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-4 py-2 text-sm font-medium text-violet-300">
                                <CalendarDays size={16} />
                                Actualizado hace 5 min
                            </span>
                        </div>
                    </div>

                    <div
                        className="grid min-w-[320px] gap-4 sm:grid-cols-2"
                        style={{ animation: 'fadeUp 0.9s ease both' }}
                    >
                        <div className="rounded-3xl border border-white/10 bg-black/20 p-5 backdrop-blur-xl">
                            <div className="mb-3 flex items-center justify-between">
                                <span className="text-sm font-semibold text-slate-400">
                                    Núcleo Analítico
                                </span>
                                <Cpu className="text-cyan-300" size={18} />
                            </div>
                            <p className="text-3xl font-black text-white">98.2%</p>
                            <p className="mt-1 text-sm text-slate-400">
                                rendimiento operativo
                            </p>
                        </div>

                        <div className="rounded-3xl border border-white/10 bg-black/20 p-5 backdrop-blur-xl">
                            <div className="mb-3 flex items-center justify-between">
                                <span className="text-sm font-semibold text-slate-400">
                                    Actividad
                                </span>
                                <Activity className="text-violet-300" size={18} />
                            </div>
                            <p className="text-3xl font-black text-white">24/7</p>
                            <p className="mt-1 text-sm text-slate-400">
                                monitoreo inteligente
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat, index) => {
                    const Icon = stat.icon

                    return (
                        <div
                            key={stat.label}
                            className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/20 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(34,211,238,0.08)]"
                            style={{ animation: `fadeUp 0.7s ease ${index * 0.12}s both` }}
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${stat.accent} opacity-60`} />
                            <div className="relative z-10">
                                <div className="mb-6 flex items-start justify-between">
                                    <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                                        <Icon className={stat.iconColor} size={24} />
                                    </div>

                                    <div className="flex items-center gap-1 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-sm font-semibold text-emerald-300">
                                        <TrendingUp size={14} />
                                        {stat.trend}
                                    </div>
                                </div>

                                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
                                    {stat.label}
                                </p>
                                <div className="mt-2 flex items-end justify-between gap-3">
                                    <h3 className="text-4xl font-black tracking-tight text-white">
                                        {stat.value}
                                    </h3>
                                    <span className="text-sm text-slate-400">{stat.detail}</span>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </section>

            <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <div className="xl:col-span-2 rounded-[30px] border border-white/10 bg-white/5 p-6 backdrop-blur-2xl lg:p-8">
                    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-300/70">
                                Analítica académica
                            </p>
                            <h3 className="mt-1 text-2xl font-black tracking-tight text-white">
                                Crecimiento de alumnos
                            </h3>
                        </div>

                        <select className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-slate-300 outline-none transition-all duration-300 focus:border-cyan-400/30">
                            <option>Últimos 7 meses</option>
                            <option>Este año</option>
                        </select>
                    </div>

                    <div className="flex h-[320px] items-end gap-3 rounded-[24px] border border-white/5 bg-black/20 p-5">
                        {monthlyData.map((value, i) => (
                            <div key={i} className="group flex h-full flex-1 flex-col items-center justify-end gap-3">
                                <div className="relative flex h-full w-full items-end overflow-hidden rounded-t-2xl rounded-b-xl bg-white/5">
                                    <div
                                        className="w-full rounded-t-2xl bg-gradient-to-t from-cyan-500 via-sky-500 to-violet-500 shadow-[0_0_20px_rgba(34,211,238,0.25)] transition-all duration-500 group-hover:brightness-125"
                                        style={{
                                            height: `${value}%`,
                                            animation: `growBar 0.9s ease ${i * 0.1}s both`,
                                        }}
                                    />
                                    <div className="absolute left-1/2 top-3 -translate-x-1/2 rounded-full border border-white/10 bg-black/40 px-2 py-1 text-xs font-bold text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:opacity-100">
                                        {value}%
                                    </div>
                                </div>
                                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 group-hover:text-cyan-300">
                                    M{i + 1}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="relative overflow-hidden rounded-[30px] border border-cyan-400/15 bg-gradient-to-br from-cyan-400/15 via-sky-500/10 to-violet-500/15 p-7 shadow-[0_0_35px_rgba(34,211,238,0.1)]">
                        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-300/10 blur-2xl" />
                        <div className="relative z-10">
                            <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-200/80">
                                Acción rápida
                            </p>
                            <h3 className="mt-3 text-3xl font-black tracking-tight text-white">
                                Crear nuevo curso
                            </h3>
                            <p className="mt-3 text-sm leading-relaxed text-slate-200/90">
                                Lanza una nueva oferta académica con una experiencia mucho más
                                visual, dinámica y elegante para tu equipo.
                            </p>

                            <Link
                                href="/cursos"
                                className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 font-bold text-slate-900 transition-all duration-300 hover:scale-[1.03]"
                            >
                                Ir a cursos
                                <ArrowUpRight size={18} />
                            </Link>
                        </div>
                    </div>

                    <div className="rounded-[30px] border border-white/10 bg-white/5 p-6 backdrop-blur-2xl">
                        <div className="mb-5 flex items-center justify-between">
                            <h3 className="text-xl font-black tracking-tight text-white">
                                Actividad reciente
                            </h3>
                            <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
                                Live
                            </span>
                        </div>

                        <div className="space-y-4">
                            {activity.map((item, i) => (
                                <div
                                    key={i}
                                    className="flex items-start gap-3 rounded-2xl border border-white/5 bg-black/20 p-4 transition-all duration-300 hover:border-cyan-400/15 hover:bg-black/30"
                                >
                                    <div className="mt-1 flex h-3 w-3 shrink-0 rounded-full bg-cyan-400 shadow-[0_0_14px_rgba(34,211,238,1)]" />
                                    <p className="text-sm leading-relaxed text-slate-300">{item}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}