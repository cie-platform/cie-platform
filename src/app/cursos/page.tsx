'use client'

export default function CursosPage() {
    const cursos = [
        {
            nombre: 'Modulo 1 - Basico',
            categoria: 'Modulo principal',
            costo: '$60',
            horas: 22,
            estado: 'Activo',
        },
        {
            nombre: 'Modulo 2 - Intermedio',
            categoria: 'Modulo principal',
            costo: '$60',
            horas: 22,
            estado: 'Activo',
        },
        {
            nombre: 'Modulo 3 - Avanzado',
            categoria: 'Modulo principal',
            costo: '$60',
            horas: 22,
            estado: 'Activo',
        },
        {
            nombre: 'Excel',
            categoria: 'Curso complementario',
            costo: 'Próximamente',
            horas: 22,
            estado: 'Próximo',
        },
        {
            nombre: 'Scratch',
            categoria: 'Curso complementario',
            costo: 'Próximamente',
            horas: 22,
            estado: 'Próximo',
        },
    ]

    function getEstadoStyles(estado: string) {
        switch (estado) {
            case 'Activo':
                return 'border border-emerald-400/20 bg-emerald-500/10 text-emerald-300'
            case 'Próximo':
                return 'border border-amber-400/20 bg-amber-500/10 text-amber-300'
            default:
                return 'border border-white/10 bg-white/5 text-slate-300'
        }
    }

    return (
        <div className="space-y-8">
            <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-300/70">
                    Gestión académica
                </p>
                <h2 className="mt-2 bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-4xl font-black tracking-tight text-transparent">
                    Módulo de Cursos CIE
                </h2>
                <p className="mt-3 max-w-3xl text-slate-400">
                    Administra los módulos de formación y los cursos complementarios del
                    sistema CIE.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {cursos.map((curso) => (
                    <div
                        key={curso.nombre}
                        className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.95),rgba(30,41,59,0.85))] p-6 shadow-2xl backdrop-blur-xl"
                    >
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
                            {curso.categoria}
                        </p>

                        <h3 className="mt-3 text-2xl font-black text-white">
                            {curso.nombre}
                        </h3>

                        <div className="mt-5 space-y-3 text-sm text-slate-300">
                            <div className="flex items-center justify-between">
                                <span>Costo</span>
                                <span className="font-bold text-white">{curso.costo}</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span>Horas</span>
                                <span className="font-bold text-white">{curso.horas} horas</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span>Estado</span>
                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-bold ${getEstadoStyles(
                                        curso.estado
                                    )}`}
                                >
                                    {curso.estado}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}