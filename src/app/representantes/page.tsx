'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Representante = {
    id: string
    nombres: string
    apellidos: string
    cedula: string
    telefono: string
    direccion: string
    correo: string
    parentesco: string
}

const initialForm = {
    nombres: '',
    apellidos: '',
    cedula: '',
    telefono: '',
    direccion: '',
    correo: '',
    parentesco: 'Representante',
}

export default function RepresentantesPage() {
    const [form, setForm] = useState(initialForm)
    const [items, setItems] = useState<Representante[]>([])
    const [editingId, setEditingId] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<string>('')

    async function loadRepresentantes() {
        const { data, error } = await supabase
            .from('representantes')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            setMessage(`Error cargando representantes: ${error.message}`)
            return
        }

        setItems(data || [])
    }

    useEffect(() => {
        loadRepresentantes()
    }, [])

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setMessage('')

        if (
            !form.nombres ||
            !form.apellidos ||
            !form.cedula ||
            !form.telefono ||
            !form.direccion ||
            !form.correo
        ) {
            setMessage('Completa todos los campos obligatorios.')
            setLoading(false)
            return
        }

        if (editingId) {
            const { error } = await supabase
                .from('representantes')
                .update(form)
                .eq('id', editingId)

            if (error) {
                setMessage(`Error actualizando: ${error.message}`)
                setLoading(false)
                return
            }

            setMessage('Representante actualizado correctamente.')
            setForm(initialForm)
            setEditingId(null)
            await loadRepresentantes()
        } else {
            const { error } = await supabase.from('representantes').insert([form])

            if (error) {
                setMessage(`Error guardando: ${error.message}`)
                setLoading(false)
                return
            }

            setMessage('Representante guardado correctamente.')
            setForm(initialForm)
            await loadRepresentantes()
        }

        setLoading(false)
    }

    function handleEdit(item: Representante) {
        setEditingId(item.id)
        setForm({
            nombres: item.nombres,
            apellidos: item.apellidos,
            cedula: item.cedula,
            telefono: item.telefono,
            direccion: item.direccion,
            correo: item.correo,
            parentesco: item.parentesco,
        })
        setMessage('')
    }

    async function handleDelete(id: string) {
        const ok = window.confirm('¿Eliminar representante?')
        if (!ok) return

        const { error } = await supabase
            .from('representantes')
            .delete()
            .eq('id', id)

        if (error) {
            setMessage(`Error eliminando: ${error.message}`)
            return
        }

        setMessage('Representante eliminado.')
        await loadRepresentantes()
    }

    return (
        <div className="space-y-8">
            <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-300/70">
                    Gestión CIE
                </p>
                <h2 className="mt-2 bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-4xl font-black tracking-tight text-transparent">
                    Representantes
                </h2>
            </div>

            {message && (
                <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-200">
                    {message}
                </div>
            )}

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[430px_1fr]">
                <div className="rounded-[30px] border border-cyan-400/15 bg-[linear-gradient(180deg,rgba(30,41,59,0.82),rgba(15,23,42,0.72))] p-6 backdrop-blur-2xl">
                    <h3 className="mb-6 text-2xl font-black text-white">
                        {editingId ? 'Editar representante' : 'Nuevo representante'}
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input name="nombres" value={form.nombres} onChange={handleChange} placeholder="Nombres" className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-slate-400" />
                        <input name="apellidos" value={form.apellidos} onChange={handleChange} placeholder="Apellidos" className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-slate-400" />
                        <input name="cedula" value={form.cedula} onChange={handleChange} placeholder="Cédula" className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-slate-400" />
                        <input name="telefono" value={form.telefono} onChange={handleChange} placeholder="Teléfono" className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-slate-400" />
                        <input name="direccion" value={form.direccion} onChange={handleChange} placeholder="Dirección" className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-slate-400" />
                        <input name="correo" value={form.correo} onChange={handleChange} placeholder="Correo" className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-slate-400" />
                        <input name="parentesco" value={form.parentesco} onChange={handleChange} placeholder="Parentesco" className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-slate-400" />

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
                                        setMessage('')
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
                    <h3 className="mb-5 text-2xl font-black text-white">Lista de representantes</h3>

                    <div className="overflow-hidden rounded-3xl border border-white/10">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-slate-700/80 via-slate-600/70 to-slate-700/80">
                                <tr>
                                    <th className="px-4 py-4 text-left text-cyan-300">Nombre</th>
                                    <th className="px-4 py-4 text-left text-cyan-300">Cédula</th>
                                    <th className="px-4 py-4 text-left text-cyan-300">Teléfono</th>
                                    <th className="px-4 py-4 text-left text-cyan-300">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item) => (
                                    <tr key={item.id} className="border-t border-white/10 bg-slate-900/30">
                                        <td className="px-4 py-4 text-white">{item.nombres} {item.apellidos}</td>
                                        <td className="px-4 py-4 text-slate-300">{item.cedula}</td>
                                        <td className="px-4 py-4 text-slate-300">{item.telefono}</td>
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
                                            No hay representantes registrados
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