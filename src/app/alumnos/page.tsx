'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Representante = {
    id: string
    nombres: string
    apellidos: string
}

type Alumno = {
    id: string
    nombres: string
    apellidos: string
    fecha_nacimiento: string
    sexo: string | null
    direccion: string | null
    observaciones: string | null
    estado: string
    representante_id: string
    representantes?: {
        nombres: string
        apellidos: string
    } | null
}

const initialForm = {
    nombres: '',
    apellidos: '',
    fecha_nacimiento: '',
    sexo: '',
    direccion: '',
    observaciones: '',
    estado: 'activo',
    representante_id: '',
}

export default function AlumnosPage() {
    const [form, setForm] = useState(initialForm)
    const [items, setItems] = useState<Alumno[]>([])
    const [representantes, setRepresentantes] = useState<Representante[]>([])
    const [editingId, setEditingId] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    async function loadRepresentantes() {
        const { data } = await supabase
            .from('representantes')
            .select('id, nombres, apellidos')
            .order('nombres', { ascending: true })

        if (data) setRepresentantes(data)
    }

    async function loadAlumnos() {
        const { data } = await supabase
            .from('alumnos')
            .select('*, representantes(nombres, apellidos)')
            .order('created_at', { ascending: false })

        if (data) setItems(data as Alumno[])
    }

    useEffect(() => {
        loadRepresentantes()
        loadAlumnos()
    }, [])

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)

        const payload = {
            ...form,
            sexo: form.sexo || null,
            direccion: form.direccion || null,
            observaciones: form.observaciones || null,
        }

        if (editingId) {
            const { error } = await supabase
                .from('alumnos')
                .update(payload)
                .eq('id', editingId)

            if (!error) {
                setEditingId(null)
                setForm(initialForm)
                await loadAlumnos()
            }
        } else {
            const { error } = await supabase.from('alumnos').insert([payload])

            if (!error) {
                setForm(initialForm)
                await loadAlumnos()
            }
        }

        setLoading(false)
    }

    function handleEdit(item: Alumno) {
        setEditingId(item.id)
        setForm({
            nombres: item.nombres,
            apellidos: item.apellidos,
            fecha_nacimiento: item.fecha_nacimiento,
            sexo: item.sexo || '',
            direccion: item.direccion || '',
            observaciones: item.observaciones || '',
            estado: item.estado,
            representante_id: item.representante_id,
        })
    }

    async function handleDelete(id: string) {
        const ok = window.confirm('¿Eliminar alumno?')
        if (!ok) return

        const { error } = await supabase.from('alumnos').delete().eq('id', id)
        if (!error) loadAlumnos()
    }

    return (
        <div className="space-y-8">
            <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-300/70">
                    Gestión académica
                </p>
                <h2 className="mt-2 bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-4xl font-black tracking-tight text-transparent">
                    Registro de Alumnos CIE
                </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[430px_1fr]">
                <div className="rounded-[30px] border border-cyan-400/15 bg-[linear-gradient(180deg,rgba(30,41,59,0.82),rgba(15,23,42,0.72))] p-6 backdrop-blur-2xl">
                    <h3 className="mb-6 text-2xl font-black text-white">
                        {editingId ? 'Editar alumno' : 'Nuevo alumno'}
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input name="nombres" value={form.nombres} onChange={handleChange} placeholder="Nombres" className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-slate-400" />
                        <input name="apellidos" value={form.apellidos} onChange={handleChange} placeholder="Apellidos" className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-slate-400" />
                        <input name="fecha_nacimiento" value={form.fecha_nacimiento} onChange={handleChange} type="date" className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none" />

                        <select name="sexo" value={form.sexo} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none">
                            <option value="">Sexo</option>
                            <option value="Masculino">Masculino</option>
                            <option value="Femenino">Femenino</option>
                        </select>

                        <input name="direccion" value={form.direccion} onChange={handleChange} placeholder="Dirección" className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-slate-400" />

                        <select name="representante_id" value={form.representante_id} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none">
                            <option value="">Selecciona representante</option>
                            {representantes.map((r) => (
                                <option key={r.id} value={r.id}>
                                    {r.nombres} {r.apellidos}
                                </option>
                            ))}
                        </select>

                        <select name="estado" value={form.estado} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none">
                            <option value="activo">Activo</option>
                            <option value="pausado">Pausado</option>
                            <option value="retirado">Retirado</option>
                            <option value="graduado">Graduado</option>
                        </select>

                        <textarea name="observaciones" value={form.observaciones} onChange={handleChange} placeholder="Observaciones" className="min-h-[110px] w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-slate-400" />

                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 px-4 py-3 font-bold text-white"
                            >
                                {loading ? 'Guardando...' : editingId ? 'Actualizar' : 'Guardar'}
                            </button>

                            {editingId && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingId(null)
                                        setForm(initialForm)
                                    }}
                                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-bold text-white"
                                >
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                <div className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(17,24,39,0.80),rgba(15,23,42,0.72))] p-6 backdrop-blur-2xl">
                    <h3 className="mb-5 text-2xl font-black text-white">Lista de alumnos</h3>

                    <div className="overflow-hidden rounded-3xl border border-white/10">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-slate-700/80 via-slate-600/70 to-slate-700/80">
                                <tr>
                                    <th className="px-4 py-4 text-left text-cyan-300">Alumno</th>
                                    <th className="px-4 py-4 text-left text-cyan-300">Representante</th>
                                    <th className="px-4 py-4 text-left text-cyan-300">Estado</th>
                                    <th className="px-4 py-4 text-left text-cyan-300">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item) => (
                                    <tr key={item.id} className="border-t border-white/10 bg-slate-900/30">
                                        <td className="px-4 py-4 text-white">{item.nombres} {item.apellidos}</td>
                                        <td className="px-4 py-4 text-slate-300">
                                            {item.representantes
                                                ? `${item.representantes.nombres} ${item.representantes.apellidos}`
                                                : 'Sin representante'}
                                        </td>
                                        <td className="px-4 py-4 text-slate-300">{item.estado}</td>
                                        <td className="px-4 py-4">
                                            <div className="flex gap-2">
                                                <button onClick={() => handleEdit(item)} className="rounded-xl bg-cyan-500/15 px-3 py-2 text-cyan-300">
                                                    Editar
                                                </button>
                                                <button onClick={() => handleDelete(item.id)} className="rounded-xl bg-red-500/15 px-3 py-2 text-red-300">
                                                    Borrar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {items.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-6 text-center text-slate-400">
                                            No hay alumnos registrados
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}