'use client'

import { useEffect, useState } from 'react'
import { getSupabaseClient } from "@/lib/supabase";

type Representante = {
    id: string
    nombres: string
    apellidos: string
    cedula: string
    telefono: string
    direccion: string
    correo: string
    parentesco: string
    created_at?: string
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
    const supabase = getSupabaseClient();

    const [form, setForm] = useState(initialForm)
    const [items, setItems] = useState<Representante[]>([])
    const [editingId, setEditingId] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [messageType, setMessageType] = useState<'success' | 'error' | ''>('')

    async function loadRepresentantes() {
        setMessage('')
        setMessageType('')

        const { data, error } = await supabase
            .from('representantes')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error cargando representantes:', error)
            setMessage(`Error cargando representantes: ${error.message}`)
            setMessageType('error')
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
        const { name, value } = e.target
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    function resetForm() {
        setForm(initialForm)
        setEditingId(null)
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        setMessage('')
        setMessageType('')

        const payload = {
            nombres: form.nombres.trim(),
            apellidos: form.apellidos.trim(),
            cedula: form.cedula.trim(),
            telefono: form.telefono.trim(),
            direccion: form.direccion.trim(),
            correo: form.correo.trim().toLowerCase(),
            parentesco: form.parentesco.trim() || 'Representante',
        }

        if (
            !payload.nombres ||
            !payload.apellidos ||
            !payload.cedula ||
            !payload.telefono ||
            !payload.direccion ||
            !payload.correo
        ) {
            setMessage('Completa todos los campos obligatorios.')
            setMessageType('error')
            setLoading(false)
            return
        }

        try {
            if (editingId) {
                const { error } = await supabase
                    .from('representantes')
                    .update(payload)
                    .eq('id', editingId)

                if (error) {
                    console.error('Error actualizando representante:', error)
                    setMessage(`Error actualizando: ${error.message}`)
                    setMessageType('error')
                    setLoading(false)
                    return
                }

                setMessage('Representante actualizado correctamente.')
                setMessageType('success')
                resetForm()
                await loadRepresentantes()
            } else {
                const { data, error } = await supabase
                    .from('representantes')
                    .insert([payload])
                    .select()

                if (error) {
                    console.error('Error guardando representante:', error)
                    setMessage(`Error guardando: ${error.message}`)
                    setMessageType('error')
                    setLoading(false)
                    return
                }

                console.log('Representante guardado:', data)
                setMessage('Representante guardado correctamente.')
                setMessageType('success')
                resetForm()
                await loadRepresentantes()
            }
        } catch (err) {
            console.error('Error inesperado:', err)
            setMessage('Ocurrió un error inesperado al guardar.')
            setMessageType('error')
        } finally {
            setLoading(false)
        }
    }

    function handleEdit(item: Representante) {
        setEditingId(item.id)
        setForm({
            nombres: item.nombres || '',
            apellidos: item.apellidos || '',
            cedula: item.cedula || '',
            telefono: item.telefono || '',
            direccion: item.direccion || '',
            correo: item.correo || '',
            parentesco: item.parentesco || 'Representante',
        })
        setMessage('')
        setMessageType('')
    }

    async function handleDelete(id: string) {
        const ok = window.confirm('¿Eliminar representante?')
        if (!ok) return

        setMessage('')
        setMessageType('')

        const { error } = await supabase
            .from('representantes')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('Error eliminando representante:', error)
            setMessage(`Error eliminando: ${error.message}`)
            setMessageType('error')
            return
        }

        setMessage('Representante eliminado correctamente.')
        setMessageType('success')
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
                <div
                    className={`rounded-2xl px-4 py-3 text-sm ${messageType === 'success'
                        ? 'border border-emerald-400/20 bg-emerald-400/10 text-emerald-200'
                        : 'border border-red-400/20 bg-red-400/10 text-red-200'
                        }`}
                >
                    {message}
                </div>
            )}

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[430px_1fr]">
                <div className="rounded-[30px] border border-cyan-400/15 bg-[linear-gradient(180deg,rgba(30,41,59,0.82),rgba(15,23,42,0.72))] p-6 backdrop-blur-2xl">
                    <h3 className="mb-6 text-2xl font-black text-white">
                        {editingId ? 'Editar representante' : 'Nuevo representante'}
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            name="nombres"
                            value={form.nombres}
                            onChange={handleChange}
                            placeholder="Nombres"
                            className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-slate-400"
                        />

                        <input
                            name="apellidos"
                            value={form.apellidos}
                            onChange={handleChange}
                            placeholder="Apellidos"
                            className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-slate-400"
                        />

                        <input
                            name="cedula"
                            value={form.cedula}
                            onChange={handleChange}
                            placeholder="Cédula"
                            className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-slate-400"
                        />

                        <input
                            name="telefono"
                            value={form.telefono}
                            onChange={handleChange}
                            placeholder="Teléfono"
                            className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-slate-400"
                        />

                        <input
                            name="direccion"
                            value={form.direccion}
                            onChange={handleChange}
                            placeholder="Dirección"
                            className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-slate-400"
                        />

                        <input
                            name="correo"
                            type="email"
                            value={form.correo}
                            onChange={handleChange}
                            placeholder="Correo"
                            className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-slate-400"
                        />

                        <input
                            name="parentesco"
                            value={form.parentesco}
                            onChange={handleChange}
                            placeholder="Parentesco"
                            className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-slate-400"
                        />

                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 px-4 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? 'Guardando...' : editingId ? 'Actualizar' : 'Guardar'}
                            </button>

                            {editingId && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        resetForm()
                                        setMessage('')
                                        setMessageType('')
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
                    <h3 className="mb-5 text-2xl font-black text-white">
                        Lista de representantes
                    </h3>

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
                                    <tr
                                        key={item.id}
                                        className="border-t border-white/10 bg-slate-900/30"
                                    >
                                        <td className="px-4 py-4 text-white">
                                            {item.nombres} {item.apellidos}
                                        </td>
                                        <td className="px-4 py-4 text-slate-300">{item.cedula}</td>
                                        <td className="px-4 py-4 text-slate-300">{item.telefono}</td>
                                        <td className="px-4 py-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="rounded-xl bg-cyan-500/15 px-3 py-2 text-cyan-300"
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="rounded-xl bg-red-500/15 px-3 py-2 text-red-300"
                                                >
                                                    Borrar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {items.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="px-4 py-6 text-center text-slate-400"
                                        >
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