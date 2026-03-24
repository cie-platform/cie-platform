'use client'

import { useEffect, useMemo, useState } from 'react'
import { getSupabaseClient } from "@/lib/supabase";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";


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
    modulo_actual: string
    inscripcion_pagada: boolean
    created_at?: string
    representantes?: {
        nombres: string
        apellidos: string
        cedula: string
        telefono: string
        direccion: string
        correo: string
        parentesco: string
    } | null
}

type AlumnoForm = {
    nombres: string
    apellidos: string
    fecha_nacimiento: string
    sexo: string
    direccion: string
    observaciones: string
    estado: string
    modulo_actual: string
    inscripcion_pagada: boolean
    representante_id: string
    rep_nombres: string
    rep_apellidos: string
    rep_cedula: string
    rep_telefono: string
    rep_direccion: string
    rep_correo: string
    rep_parentesco: string
}

type FormErrors = Partial<Record<keyof AlumnoForm, string>>

const initialForm: AlumnoForm = {
    nombres: '',
    apellidos: '',
    fecha_nacimiento: '',
    sexo: '',
    direccion: '',
    observaciones: '',
    estado: 'activo',
    modulo_actual: 'Modulo 1 - Basico',
    inscripcion_pagada: false,
    representante_id: '',
    rep_nombres: '',
    rep_apellidos: '',
    rep_cedula: '',
    rep_telefono: '',
    rep_direccion: '',
    rep_correo: '',
    rep_parentesco: 'Representante',
}

export default function AlumnosPage() {

    const [form, setForm] = useState<AlumnoForm>(initialForm)
    const [items, setItems] = useState<Alumno[]>([])
    const [editingId, setEditingId] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [loadingData, setLoadingData] = useState(true)
    const [selectedAlumno, setSelectedAlumno] = useState<Alumno | null>(null)

    const [search, setSearch] = useState('')
    const [estadoFilter, setEstadoFilter] = useState('todos')

    const [message, setMessage] = useState('')
    const [messageType, setMessageType] = useState<'success' | 'error' | ''>('')

    const [errors, setErrors] = useState<FormErrors>({})
    const [formPanelOpen, setFormPanelOpen] = useState(false)
    const [viewPanelOpen, setViewPanelOpen] = useState(false)

    async function loadAlumnos() {
        const supabase = getSupabaseClient();

        const { data, error } = await supabase
            .from('alumnos')
            .select(`
            *,
            representantes(
                nombres,
                apellidos,
                cedula,
                telefono,
                direccion,
                correo,
                parentesco
            )
        `)
            .order('created_at', { ascending: false });

        if (!error) setItems((data as Alumno[]) || []);
    }

    async function loadAll() {
        setLoadingData(true)
        await loadAlumnos()
        setLoadingData(false)
    }

    useEffect(() => {
        loadAll()
    }, [])

    function clearGeneralMessage() {
        setMessage('')
        setMessageType('')
    }

    function soloNumeros(valor: string) {
        return valor.replace(/\D/g, '')
    }

    function validarCorreo(correo: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)
    }

    function calcularEdad(fecha: string) {
        if (!fecha) return '-'

        const hoy = new Date()
        const nacimiento = new Date(fecha + 'T00:00:00')

        let edad = hoy.getFullYear() - nacimiento.getFullYear()
        const mes = hoy.getMonth() - nacimiento.getMonth()

        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--
        }

        return edad < 0 ? 0 : edad
    }

    function esFechaFutura(fecha: string) {
        if (!fecha) return false

        const hoy = new Date()
        const fechaIngresada = new Date(fecha + 'T00:00:00')
        hoy.setHours(0, 0, 0, 0)

        return fechaIngresada > hoy
    }

    function esMenorDeCinco(fecha: string) {
        const edad = calcularEdad(fecha)
        return typeof edad === 'number' && edad < 5
    }

    function formatearTelefonoGuardar(diezDigitos: string) {
        const limpio = soloNumeros(diezDigitos)
        if (limpio.length !== 10) return limpio
        if (limpio.startsWith('0')) {
            return `(593) ${limpio.slice(1)}`
        }
        return `(593) ${limpio}`
    }

    function extraerTelefonoLocal(telefonoGuardado: string) {
        const numeros = telefonoGuardado.replace(/\D/g, '')
        if (numeros.startsWith('593') && numeros.length >= 12) {
            return `0${numeros.slice(3, 12)}`
        }
        return numeros.slice(0, 10)
    }

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) {
        const { name, value } = e.target
        clearGeneralMessage()

        if (name === 'inscripcion_pagada') {
            setForm((prev) => ({
                ...prev,
                inscripcion_pagada: value === 'true',
            }))
            setErrors((prev) => ({ ...prev, inscripcion_pagada: '' }))
            return
        }

        if (name === 'rep_cedula') {
            setForm((prev) => ({
                ...prev,
                rep_cedula: soloNumeros(value).slice(0, 10),
            }))
            setErrors((prev) => ({ ...prev, rep_cedula: '' }))
            return
        }

        if (name === 'rep_telefono') {
            setForm((prev) => ({
                ...prev,
                rep_telefono: soloNumeros(value).slice(0, 10),
            }))
            setErrors((prev) => ({ ...prev, rep_telefono: '' }))
            return
        }

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }))

        setErrors((prev) => ({
            ...prev,
            [name]: '',
        }))
    }

    function resetForm() {
        setForm(initialForm)
        setEditingId(null)
        setErrors({})
    }

    function openCreatePanel() {
        resetForm()
        clearGeneralMessage()
        setFormPanelOpen(true)
    }

    function closeFormPanel() {
        if (loading) return
        setFormPanelOpen(false)
        setTimeout(() => {
            resetForm()
        }, 180)
    }

    function openViewPanel(item: Alumno) {
        setSelectedAlumno(item)
        setViewPanelOpen(true)
    }

    function closeViewPanel() {
        setViewPanelOpen(false)
        setTimeout(() => {
            setSelectedAlumno(null)
        }, 180)
    }

    function validateForm(values: AlumnoForm) {
        const newErrors: FormErrors = {}

        if (!values.nombres.trim()) newErrors.nombres = 'Los nombres son obligatorios.'
        if (!values.apellidos.trim()) newErrors.apellidos = 'Los apellidos son obligatorios.'

        if (!values.fecha_nacimiento) {
            newErrors.fecha_nacimiento = 'La fecha de nacimiento es obligatoria.'
        } else if (esFechaFutura(values.fecha_nacimiento)) {
            newErrors.fecha_nacimiento = 'La fecha de nacimiento no puede ser futura.'
        } else if (esMenorDeCinco(values.fecha_nacimiento)) {
            newErrors.fecha_nacimiento = 'El alumno debe tener mínimo 5 años.'
        }

        if (!values.sexo) newErrors.sexo = 'Selecciona el sexo.'
        if (!values.direccion.trim()) newErrors.direccion = 'La dirección es obligatoria.'
        if (!values.observaciones.trim()) {
            newErrors.observaciones = 'Las observaciones son obligatorias.'
        }
        if (!values.estado) newErrors.estado = 'Selecciona el estado.'
        if (!values.modulo_actual) newErrors.modulo_actual = 'Selecciona el módulo.'

        if (!values.rep_nombres.trim()) {
            newErrors.rep_nombres = 'Los nombres del representante son obligatorios.'
        }
        if (!values.rep_apellidos.trim()) {
            newErrors.rep_apellidos = 'Los apellidos del representante son obligatorios.'
        }

        if (!values.rep_cedula.trim()) {
            newErrors.rep_cedula = 'La cédula es obligatoria.'
        } else if (!/^\d{10}$/.test(values.rep_cedula.trim())) {
            newErrors.rep_cedula = 'La cédula debe tener exactamente 10 dígitos.'
        }

        if (!values.rep_telefono.trim()) {
            newErrors.rep_telefono = 'El teléfono es obligatorio.'
        } else if (!/^\d{10}$/.test(values.rep_telefono.trim())) {
            newErrors.rep_telefono = 'El teléfono debe tener 10 dígitos.'
        }

        if (!values.rep_correo.trim()) {
            newErrors.rep_correo = 'El correo es obligatorio.'
        } else if (!validarCorreo(values.rep_correo.trim().toLowerCase())) {
            newErrors.rep_correo = 'Ingresa un correo válido.'
        }

        if (!values.rep_direccion.trim()) {
            newErrors.rep_direccion = 'La dirección del representante es obligatoria.'
        }

        if (!values.rep_parentesco.trim()) {
            newErrors.rep_parentesco = 'El parentesco es obligatorio.'
        }

        return newErrors
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        clearGeneralMessage();

        const validationErrors = validateForm(form);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            setMessage('Revisa los campos obligatorios antes de guardar.');
            setMessageType('error');
            return;
        }

        setLoading(true);

        const supabase = getSupabaseClient();

        const representantePayload = {
            nombres: form.rep_nombres.trim(),
            apellidos: form.rep_apellidos.trim(),
            cedula: form.rep_cedula.trim(),
            telefono: formatearTelefonoGuardar(form.rep_telefono.trim()),
            direccion: form.rep_direccion.trim(),
            correo: form.rep_correo.trim().toLowerCase(),
            parentesco: form.rep_parentesco.trim(),
        };

        let representanteId = form.representante_id;

        if (editingId && form.representante_id) {
            const { error: repUpdateError } = await supabase
                .from('representantes')
                .update(representantePayload)
                .eq('id', form.representante_id);

            if (repUpdateError) {
                setMessage(repUpdateError.message || 'Error actualizando representante.');
                setMessageType('error');
                setLoading(false);
                return;
            }
        } else {
            const { data: repData, error: repInsertError } = await supabase
                .from('representantes')
                .insert([representantePayload])
                .select('id')
                .single();

            if (repInsertError || !repData) {
                setMessage(repInsertError?.message || 'Error guardando representante.');
                setMessageType('error');
                setLoading(false);
                return;
            }

            representanteId = repData.id;
        }

        const alumnoPayload = {
            nombres: form.nombres.trim(),
            apellidos: form.apellidos.trim(),
            fecha_nacimiento: form.fecha_nacimiento,
            sexo: form.sexo,
            direccion: form.direccion.trim(),
            observaciones: form.observaciones.trim(),
            estado: form.estado,
            modulo_actual: form.modulo_actual,
            inscripcion_pagada: form.inscripcion_pagada,
            representante_id: representanteId,
        };

        if (editingId) {
            const { error } = await supabase
                .from('alumnos')
                .update(alumnoPayload)
                .eq('id', editingId);

            if (!error) {
                setMessage('Alumno actualizado correctamente.');
                setMessageType('success');
                setFormPanelOpen(false);
                resetForm();
                await loadAlumnos();
            } else {
                setMessage(error.message || 'Error actualizando alumno.');
                setMessageType('error');
            }
        } else {
            const { error } = await supabase.from('alumnos').insert([alumnoPayload]);

            if (!error) {
                setMessage('Alumno guardado correctamente.');
                setMessageType('success');
                setFormPanelOpen(false);
                resetForm();
                await loadAlumnos();
            } else {
                setMessage(error.message || 'Error guardando alumno.');
                setMessageType('error');
            }
        }

        setLoading(false);
    }

    function handleEdit(item: Alumno) {
        clearGeneralMessage()
        setEditingId(item.id)
        setErrors({})

        setForm({
            nombres: item.nombres,
            apellidos: item.apellidos,
            fecha_nacimiento: item.fecha_nacimiento,
            sexo: item.sexo || '',
            direccion: item.direccion || '',
            observaciones: item.observaciones || '',
            estado: item.estado,
            modulo_actual: item.modulo_actual || 'Modulo 1 - Basico',
            inscripcion_pagada: item.inscripcion_pagada ?? false,
            representante_id: item.representante_id,
            rep_nombres: item.representantes?.nombres || '',
            rep_apellidos: item.representantes?.apellidos || '',
            rep_cedula: item.representantes?.cedula || '',
            rep_telefono: extraerTelefonoLocal(item.representantes?.telefono || ''),
            rep_direccion: item.representantes?.direccion || '',
            rep_correo: item.representantes?.correo || '',
            rep_parentesco: item.representantes?.parentesco || 'Representante',
        })

        setFormPanelOpen(true)
    }

    async function handleDelete(id: string) {
        const ok = window.confirm('¿Eliminar alumno?');
        if (!ok) return;

        clearGeneralMessage();

        const supabase = getSupabaseClient();

        const { error } = await supabase.from('alumnos').delete().eq('id', id);

        if (!error) {
            setMessage('Alumno eliminado correctamente.');
            setMessageType('success');
            await loadAlumnos();
        } else {
            setMessage(error.message || 'Error eliminando alumno.');
            setMessageType('error');
        }
    }

    function getEstadoStyles(estado: string) {
        switch (estado) {
            case 'activo':
                return 'border border-emerald-400/20 bg-emerald-500/15 text-emerald-300'
            case 'pausado':
                return 'border border-yellow-400/20 bg-yellow-500/15 text-yellow-300'
            case 'retirado':
                return 'border border-red-400/20 bg-red-500/15 text-red-300'
            case 'graduado':
                return 'border border-violet-400/20 bg-violet-500/15 text-violet-300'
            default:
                return 'border border-white/10 bg-white/10 text-slate-300'
        }
    }

    function getModuloStyles(modulo: string) {
        switch (modulo) {
            case 'Modulo 1 - Basico':
                return 'border border-cyan-400/20 bg-cyan-500/15 text-cyan-300'
            case 'Modulo 2 - Intermedio':
                return 'border border-amber-400/20 bg-amber-500/15 text-amber-300'
            case 'Modulo 3 - Avanzado':
                return 'border border-fuchsia-400/20 bg-fuchsia-500/15 text-fuchsia-300'
            default:
                return 'border border-white/10 bg-white/10 text-slate-300'
        }
    }

    const filteredItems = useMemo(() => {
        return items.filter((item) => {
            const texto =
                `${item.nombres} ${item.apellidos} ${item.representantes?.nombres || ''} ${item.representantes?.apellidos || ''}`.toLowerCase()

            const coincideBusqueda = texto.includes(search.toLowerCase())
            const coincideEstado =
                estadoFilter === 'todos' ? true : item.estado === estadoFilter

            return coincideBusqueda && coincideEstado
        })
    }, [items, search, estadoFilter])

    const noHayRegistros = items.length === 0
    const noHayResultados = items.length > 0 && filteredItems.length === 0

    function fieldBaseClass(hasError?: boolean) {
        return `w-full rounded-2xl border px-4 py-3 text-sm text-white outline-none transition-all duration-300 ${hasError
            ? 'border-red-400/40 bg-red-500/5 focus:border-red-400 focus:shadow-[0_0_20px_rgba(248,113,113,0.35)]'
            : 'border-white/10 bg-white/10 focus:border-cyan-400/50 focus:bg-white/[0.14] focus:shadow-[0_0_25px_rgba(34,211,238,0.35)]'
            } placeholder:text-slate-400`
    }

    function helperError(text?: string) {
        if (!text) return null
        return <p className="mt-1 text-xs text-red-300">{text}</p>
    }

    function exportToExcel() {
        if (!items || items.length === 0) {
            alert("No hay alumnos para exportar");
            return;
        }

        const data = items.map((alumno: any) => ({
            "Nombres": alumno.nombres || "",
            "Apellidos": alumno.apellidos || "",
            "Cédula": alumno.cedula || "",
            "Teléfono": alumno.telefono || "",
            "Dirección": alumno.direccion || "",
            "Correo electrónico": alumno.correo || "",
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);

        // 👇 SOLUCIÓN TOTAL ERROR TYPESCRIPT
        (worksheet as any)["!cols"] = [
            { wch: 20 },
            { wch: 20 },
            { wch: 15 },
            { wch: 15 },
            { wch: 30 },
            { wch: 30 },
        ];

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Alumnos");

        XLSX.writeFile(workbook, "alumnos.xlsx");
    }

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_20%),radial-gradient(circle_at_top_right,rgba(139,92,246,0.16),transparent_24%),linear-gradient(180deg,#020617_0%,#020816_46%,#030b1f_100%)] text-white">
            <div className="space-y-8 p-5 md:p-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.35em] text-cyan-300/70">
                            Gestión académica
                        </p>
                        <h2 className="mt-2 bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-4xl font-black tracking-tight text-transparent md:text-5xl">
                            Registro de Alumnos CIE
                        </h2>
                        <p className="mt-3 max-w-3xl text-slate-400">
                            Lista principal limpia, acciones rápidas y ventanas centradas para crear, editar y consultar.
                        </p>
                    </div>

                    <div className="flex gap-3">

                        <button
                            onClick={exportToExcel}
                            className="rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 px-5 py-3 font-bold text-white shadow-[0_0_30px_rgba(59,130,246,0.35)] transition hover:scale-[1.02]"
                        >
                            Exportar
                        </button>

                        <button
                            onClick={openCreatePanel}
                            className="rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 px-6 py-3 font-bold text-white shadow-[0_0_30px_rgba(59,130,246,0.35)] transition hover:scale-[1.02]"
                        >
                            + Nuevo alumno
                        </button>

                    </div>


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

                <div className="rounded-[32px] border border-cyan-400/10 bg-[linear-gradient(180deg,rgba(8,15,35,0.92),rgba(4,11,28,0.88))] p-5 shadow-[0_0_60px_rgba(34,211,238,0.08)] backdrop-blur-2xl">
                    <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h3 className="text-2xl font-black text-white">Lista de alumnos</h3>
                            <p className="mt-1 text-sm text-slate-400">
                                Consulta rápida y acciones sin salir de la pantalla.
                            </p>
                        </div>


                        <div className="flex flex-col gap-3 md:flex-row">
                            <input
                                type="text"
                                placeholder="Buscar alumno o representante..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                autoComplete="off"
                                className="w-full rounded-2xl border border-cyan-400/20 bg-slate-950/70 px-4 py-3 text-white outline-none placeholder:text-slate-400 focus:border-cyan-400 md:min-w-[320px]"
                            />

                            <select
                                value={estadoFilter}
                                onChange={(e) => setEstadoFilter(e.target.value)}
                                className="w-full rounded-2xl border border-violet-400/30 bg-slate-950/80 px-4 py-3 text-violet-200 outline-none focus:border-violet-400 md:min-w-[220px]"
                            >
                                <option value="todos" className="bg-slate-900 text-white">
                                    Todos los estados
                                </option>
                                <option value="activo" className="bg-slate-900 text-violet-200">
                                    Activo
                                </option>
                                <option value="pausado" className="bg-slate-900 text-violet-200">
                                    Pausado
                                </option>
                                <option value="retirado" className="bg-slate-900 text-violet-200">
                                    Retirado
                                </option>
                                <option value="graduado" className="bg-slate-900 text-violet-200">
                                    Graduado
                                </option>
                            </select>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-3xl border border-white/10">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[980px]">
                                <thead className="bg-[linear-gradient(90deg,rgba(51,65,85,0.95),rgba(37,99,235,0.18),rgba(88,28,135,0.25))]">
                                    <tr>
                                        <th className="px-4 py-4 text-left text-cyan-300">Alumno</th>
                                        <th className="px-4 py-4 text-left text-cyan-300">Edad</th>
                                        <th className="px-4 py-4 text-left text-cyan-300">Módulo</th>
                                        <th className="px-4 py-4 text-left text-cyan-300">Representante</th>
                                        <th className="px-4 py-4 text-left text-cyan-300">Estado</th>
                                        <th className="px-4 py-4 text-left text-cyan-300">Acciones</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {loadingData ? (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                                                Cargando alumnos...
                                            </td>
                                        </tr>
                                    ) : (
                                        <>
                                            {filteredItems.map((item) => (
                                                <tr
                                                    key={item.id}
                                                    className="group border-t border-white/10 bg-slate-900/20 transition-all duration-300 hover:bg-cyan-500/[0.05] hover:shadow-[inset_0_0_0_1px_rgba(34,211,238,0.15)]"
                                                >
                                                    <td className="px-4 py-4 text-white">
                                                        <div>
                                                            <p className="font-semibold transition group-hover:text-cyan-300">
                                                                {item.nombres} {item.apellidos}
                                                            </p>
                                                            <p className="mt-1 text-xs text-slate-500">
                                                                {item.sexo || 'Sin sexo registrado'}
                                                            </p>
                                                        </div>
                                                    </td>

                                                    <td className="px-4 py-4 text-slate-300">
                                                        {calcularEdad(item.fecha_nacimiento)}
                                                    </td>

                                                    <td className="px-4 py-4">
                                                        <span
                                                            className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getModuloStyles(
                                                                item.modulo_actual
                                                            )}`}
                                                        >
                                                            {item.modulo_actual}
                                                        </span>
                                                    </td>

                                                    <td className="px-4 py-4 text-slate-300">
                                                        {item.representantes
                                                            ? `${item.representantes.nombres} ${item.representantes.apellidos}`
                                                            : 'Sin representante'}
                                                    </td>

                                                    <td className="px-4 py-4">
                                                        <span
                                                            className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase ${getEstadoStyles(
                                                                item.estado
                                                            )}`}
                                                        >
                                                            {item.estado}
                                                        </span>
                                                    </td>

                                                    <td className="px-4 py-4">
                                                        <div className="flex flex-wrap gap-2">
                                                            <button
                                                                onClick={() => openViewPanel(item)}
                                                                className="group relative overflow-hidden rounded-xl border border-emerald-400/20 bg-emerald-500/15 px-3 py-2 text-sm font-semibold text-emerald-300 transition-all duration-300 hover:scale-105 hover:bg-emerald-500/25"
                                                            >
                                                                <span className="relative z-10">Ver</span>
                                                                <span className="absolute inset-0 opacity-0 transition group-hover:opacity-100">
                                                                    <span className="absolute inset-0 bg-emerald-400/10 blur-xl"></span>
                                                                </span>
                                                            </button>

                                                            <button
                                                                onClick={() => handleEdit(item)}
                                                                className="group relative overflow-hidden rounded-xl border border-cyan-400/20 bg-cyan-500/15 px-3 py-2 text-sm font-semibold text-cyan-300 transition-all duration-300 hover:scale-105 hover:bg-cyan-500/25"
                                                            >
                                                                <span className="relative z-10">Editar</span>
                                                                <span className="absolute inset-0 opacity-0 transition group-hover:opacity-100">
                                                                    <span className="absolute inset-0 bg-cyan-400/10 blur-xl"></span>
                                                                </span>
                                                            </button>

                                                            <button
                                                                onClick={() => handleDelete(item.id)}
                                                                className="group relative overflow-hidden rounded-xl border border-red-400/20 bg-red-500/15 px-3 py-2 text-sm font-semibold text-red-300 transition-all duration-300 hover:scale-105 hover:bg-red-500/25"
                                                            >
                                                                <span className="relative z-10">Borrar</span>
                                                                <span className="absolute inset-0 opacity-0 transition group-hover:opacity-100">
                                                                    <span className="absolute inset-0 bg-red-400/10 blur-xl"></span>
                                                                </span>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}

                                            {noHayRegistros && (
                                                <tr>
                                                    <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                                                        No hay alumnos registrados
                                                    </td>
                                                </tr>
                                            )}

                                            {noHayResultados && (
                                                <tr>
                                                    <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                                                        No se encontraron alumnos con esa búsqueda o filtro
                                                    </td>
                                                </tr>
                                            )}
                                        </>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {(formPanelOpen || viewPanelOpen) && (
                <div className="fixed inset-0 z-40 bg-black/80 backdrop-blur-[12px] transition-all duration-500" />
            )}

            <div
                className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-500 ${formPanelOpen
                    ? 'pointer-events-auto opacity-100 backdrop-blur-xl bg-slate-950/70'
                    : 'pointer-events-none opacity-0 backdrop-blur-0'
                    }`}
            >
                <div
                    className={`relative flex h-[88vh] w-full max-w-4xl transform flex-col overflow-hidden rounded-[40px] border border-cyan-300/30 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.22),transparent_18%),radial-gradient(circle_at_top_right,rgba(139,92,246,0.22),transparent_22%),linear-gradient(180deg,rgba(6,10,24,0.99),rgba(10,18,38,0.98))] shadow-[0_0_140px_rgba(34,211,238,0.22),0_40px_120px_rgba(0,0,0,0.65)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${formPanelOpen
                        ? 'translate-y-0 scale-100 rotate-0 opacity-100'
                        : 'translate-y-16 scale-95 rotate-[0.6deg] opacity-0'
                        }`}
                >
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(34,211,238,0.03),transparent_30%,rgba(139,92,246,0.04))]" />

                    <div className="relative flex h-full flex-col">
                        <div className="border-b border-cyan-300/15 bg-[radial-gradient(circle_at_left,rgba(34,211,238,0.16),transparent_22%),linear-gradient(90deg,rgba(8,15,35,0.96),rgba(20,28,58,0.96),rgba(58,28,97,0.92))] px-7 py-7 shadow-[0_10px_40px_rgba(34,211,238,0.06)]">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-[0.32em] text-cyan-300/70">
                                        {editingId ? 'Edición rápida' : 'Nuevo registro'}
                                    </p>
                                    <h3 className="mt-2 text-4xl font-semibold tracking-tight text-white md:text-5xl">
                                        {editingId ? 'Editar alumno' : 'Nuevo alumno'}
                                    </h3>
                                    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                                        Completa alumno y representante en una experiencia centrada, limpia y rápida.
                                    </p>
                                </div>

                                <button
                                    onClick={closeFormPanel}
                                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 font-semibold text-white transition hover:bg-white/10"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>

                        <div className="relative flex-1 overflow-y-auto px-6 py-6">
                            <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
                                <div className="rounded-3xl border border-cyan-400/15 bg-cyan-500/[0.05] p-5">
                                    <p className="text-sm font-bold text-cyan-300">Paso 1 · Datos del alumno</p>

                                    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div>
                                            <InputPro
                                                name="nombres"
                                                value={form.nombres}
                                                onChange={handleChange}
                                                placeholder="Nombres"
                                                error={!!errors.nombres}
                                                icon={<span>👤</span>}
                                            />
                                            {helperError(errors.nombres)}
                                        </div>

                                        <div>
                                            <InputPro
                                                name="apellidos"
                                                value={form.apellidos}
                                                onChange={handleChange}
                                                placeholder="Apellidos"
                                                error={!!errors.apellidos}
                                                icon={<span>👤</span>}
                                            />
                                            {helperError(errors.apellidos)}
                                        </div>

                                        <div>
                                            <input
                                                name="fecha_nacimiento"
                                                value={form.fecha_nacimiento}
                                                onChange={handleChange}
                                                type="date"
                                                max={new Date().toISOString().split('T')[0]}
                                                className={fieldBaseClass(!!errors.fecha_nacimiento)}
                                            />
                                            <p className="mt-1 text-xs text-slate-400">
                                                Edad mínima permitida: 5 años.
                                            </p>
                                            {helperError(errors.fecha_nacimiento)}
                                        </div>

                                        <div>
                                            <select
                                                name="sexo"
                                                value={form.sexo}
                                                onChange={handleChange}
                                                className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition ${errors.sexo
                                                    ? 'border-red-400/40 bg-red-500/5 text-red-200'
                                                    : 'border-cyan-400/30 bg-slate-900/90 text-cyan-200'
                                                    }`}
                                            >
                                                <option value="" className="bg-slate-900 text-white">
                                                    Selecciona sexo
                                                </option>
                                                <option value="Masculino" className="bg-slate-900 text-cyan-200">
                                                    Masculino
                                                </option>
                                                <option value="Femenino" className="bg-slate-900 text-cyan-200">
                                                    Femenino
                                                </option>
                                            </select>
                                            {helperError(errors.sexo)}
                                        </div>

                                        <div className="md:col-span-2">
                                            <InputPro
                                                name="direccion"
                                                value={form.direccion}
                                                onChange={handleChange}
                                                placeholder="Dirección completa del alumno"
                                                error={!!errors.direccion}
                                                icon={<span>📍</span>}
                                            />
                                            {helperError(errors.direccion)}
                                        </div>

                                        <div>
                                            <select
                                                name="modulo_actual"
                                                value={form.modulo_actual}
                                                onChange={handleChange}
                                                className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition ${errors.modulo_actual
                                                    ? 'border-red-400/40 bg-red-500/5 text-red-200'
                                                    : 'border-amber-400/30 bg-slate-900/90 text-amber-200'
                                                    }`}
                                            >
                                                <option value="Modulo 1 - Basico" className="bg-slate-900 text-amber-200">
                                                    Modulo 1 - Basico
                                                </option>
                                                <option value="Modulo 2 - Intermedio" className="bg-slate-900 text-amber-200">
                                                    Modulo 2 - Intermedio
                                                </option>
                                                <option value="Modulo 3 - Avanzado" className="bg-slate-900 text-amber-200">
                                                    Modulo 3 - Avanzado
                                                </option>
                                            </select>
                                            <p className="mt-1 text-xs text-slate-400">
                                                Todos inician normalmente en Módulo 1 - Básico.
                                            </p>
                                            {helperError(errors.modulo_actual)}
                                        </div>

                                        <div>
                                            <select
                                                name="inscripcion_pagada"
                                                value={String(form.inscripcion_pagada)}
                                                onChange={handleChange}
                                                className="w-full rounded-2xl border border-emerald-400/30 bg-slate-900/90 px-4 py-3 text-sm text-emerald-200 outline-none"
                                            >
                                                <option value="false" className="bg-slate-900 text-emerald-200">
                                                    Inscripción pendiente
                                                </option>
                                                <option value="true" className="bg-slate-900 text-emerald-200">
                                                    Inscripción pagada
                                                </option>
                                            </select>
                                        </div>

                                        <div className="md:col-span-2">
                                            <select
                                                name="estado"
                                                value={form.estado}
                                                onChange={handleChange}
                                                className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition ${errors.estado
                                                    ? 'border-red-400/40 bg-red-500/5 text-red-200'
                                                    : 'border-violet-400/30 bg-slate-900/90 text-violet-200'
                                                    }`}
                                            >
                                                <option value="activo" className="bg-slate-900 text-violet-200">
                                                    Activo
                                                </option>
                                                <option value="pausado" className="bg-slate-900 text-violet-200">
                                                    Pausado
                                                </option>
                                                <option value="retirado" className="bg-slate-900 text-violet-200">
                                                    Retirado
                                                </option>
                                                <option value="graduado" className="bg-slate-900 text-violet-200">
                                                    Graduado
                                                </option>
                                            </select>
                                            {helperError(errors.estado)}
                                        </div>

                                        <div className="md:col-span-2">
                                            <textarea
                                                name="observaciones"
                                                value={form.observaciones}
                                                onChange={handleChange}
                                                placeholder="Observaciones obligatorias"
                                                autoComplete="new-password"
                                                className={`min-h-[110px] w-full rounded-2xl border px-4 py-3 text-sm outline-none transition ${errors.observaciones
                                                    ? 'border-red-400/40 bg-red-500/5 text-red-200'
                                                    : 'border-white/10 bg-white/10 text-white focus:border-cyan-400/40'
                                                    } placeholder:text-slate-400`}
                                            />
                                            {helperError(errors.observaciones)}
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-3xl border border-emerald-400/20 bg-emerald-500/[0.05] p-5">
                                    <p className="text-sm font-bold text-emerald-300">Paso 2 · Datos del representante</p>

                                    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div>
                                            <InputPro
                                                name="rep_nombres"
                                                value={form.rep_nombres}
                                                onChange={handleChange}
                                                placeholder="Nombres del representante"
                                                error={!!errors.rep_nombres}
                                                icon={<span>👤</span>}
                                            />
                                            {helperError(errors.rep_nombres)}
                                        </div>

                                        <div>
                                            <InputPro
                                                name="rep_apellidos"
                                                value={form.rep_apellidos}
                                                onChange={handleChange}
                                                placeholder="Apellidos del representante"
                                                error={!!errors.rep_apellidos}
                                                icon={<span>👤</span>}
                                            />
                                            {helperError(errors.rep_apellidos)}
                                        </div>

                                        <div>
                                            <InputPro
                                                name="rep_cedula"
                                                value={form.rep_cedula}
                                                onChange={handleChange}
                                                placeholder="Cédula (10 dígitos)"
                                                maxLength={10}
                                                autoComplete="new-password"
                                                inputMode="numeric"
                                                error={!!errors.rep_cedula}
                                                icon={<span>🪪</span>}
                                            />
                                            <p className="mt-1 text-xs text-slate-400">
                                                Solo números, exactamente 10 dígitos.
                                            </p>
                                            {helperError(errors.rep_cedula)}
                                        </div>

                                        <div>
                                            <InputPro
                                                name="rep_telefono"
                                                value={form.rep_telefono}
                                                onChange={handleChange}
                                                placeholder="0985512122"
                                                maxLength={10}
                                                autoComplete="new-password"
                                                inputMode="numeric"
                                                error={!!errors.rep_telefono}
                                                icon={<span className="text-lg">📱</span>}
                                            />
                                            <p className="mt-1 text-xs text-slate-400">
                                                Escribe 10 dígitos. Se guardará con prefijo Ecuador.
                                            </p>
                                            {helperError(errors.rep_telefono)}
                                        </div>

                                        <div>
                                            <InputPro
                                                name="rep_correo"
                                                type="email"
                                                value={form.rep_correo}
                                                onChange={handleChange}
                                                placeholder="correo@dominio.com"
                                                autoComplete="new-password"
                                                error={!!errors.rep_correo}
                                                icon={<span className="text-lg">📧</span>}
                                            />
                                            {helperError(errors.rep_correo)}
                                        </div>

                                        <div>
                                            <InputPro
                                                name="rep_parentesco"
                                                value={form.rep_parentesco}
                                                onChange={handleChange}
                                                placeholder="Parentesco"
                                                autoComplete="new-password"
                                                error={!!errors.rep_parentesco}
                                                icon={<span className="text-lg">👨‍👩‍👦</span>}
                                            />
                                            {helperError(errors.rep_parentesco)}
                                        </div>

                                        <div className="md:col-span-2">
                                            <InputPro
                                                name="rep_direccion"
                                                value={form.rep_direccion}
                                                onChange={handleChange}
                                                placeholder="Dirección del representante"
                                                autoComplete="new-password"
                                                error={!!errors.rep_direccion}
                                                icon={<span className="text-lg">📍</span>}
                                            />
                                            {helperError(errors.rep_direccion)}
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-3xl border border-amber-400/20 bg-amber-500/[0.05] p-5">
                                    <p className="text-sm font-bold text-amber-300">Paso 3 · Guardado</p>
                                    <p className="mt-2 text-sm text-slate-300">
                                        Guarda sin salir de la lista principal. Luego puedes ver o editar al instante.
                                    </p>
                                </div>

                                <div className="sticky bottom-0 flex gap-3 border-t border-white/10 bg-[linear-gradient(180deg,rgba(7,12,28,0.15),rgba(7,12,28,0.96))] py-4 backdrop-blur-xl">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="group relative flex-1 overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 px-4 py-3 font-bold text-white shadow-[0_0_55px_rgba(59,130,246,0.30)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_85px_rgba(59,130,246,0.50)] active:scale-[0.98] disabled:opacity-70"
                                    >
                                        <span className="relative z-10">
                                            {loading
                                                ? 'Guardando...'
                                                : editingId
                                                    ? 'Actualizar alumno'
                                                    : 'Guardar alumno'}
                                        </span>

                                        <span className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
                                            <span className="absolute inset-0 bg-white/10 blur-xl" />
                                        </span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={closeFormPanel}
                                        className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-bold text-white"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <div
                className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-500 ${viewPanelOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
                    }`}
            >
                <div
                    className={`relative flex h-[88vh] w-full max-w-4xl transform flex-col overflow-hidden rounded-[34px] border border-violet-400/20 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.08),transparent_22%),radial-gradient(circle_at_top_right,rgba(139,92,246,0.12),transparent_28%),linear-gradient(180deg,rgba(8,14,32,0.98),rgba(18,23,45,0.98))] shadow-[0_0_80px_rgba(139,92,246,0.10)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${viewPanelOpen
                        ? 'translate-y-0 scale-100 opacity-100'
                        : 'translate-y-12 scale-95 opacity-0'
                        }`}
                >
                    <div className="border-b border-white/10 bg-white/[0.03] px-6 py-5">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.32em] text-cyan-300/70">
                                    Ficha del estudiante
                                </p>
                                <h3 className="mt-2 text-3xl font-black text-white md:text-4xl">
                                    {selectedAlumno
                                        ? `${selectedAlumno.nombres} ${selectedAlumno.apellidos}`
                                        : 'Alumno'}
                                </h3>
                            </div>

                            <button
                                onClick={closeViewPanel}
                                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 font-semibold text-white transition hover:bg-white/10"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6">
                        {selectedAlumno && (
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <Card label="Nombres" value={selectedAlumno.nombres} />
                                <Card label="Apellidos" value={selectedAlumno.apellidos} />
                                <Card
                                    label="Fecha de nacimiento"
                                    value={selectedAlumno.fecha_nacimiento || 'No registrada'}
                                />
                                <Card
                                    label="Edad"
                                    value={String(calcularEdad(selectedAlumno.fecha_nacimiento))}
                                />
                                <Card label="Sexo" value={selectedAlumno.sexo || 'No registrado'} />
                                <Card label="Estado" value={selectedAlumno.estado} />
                                <Card label="Módulo asignado" value={selectedAlumno.modulo_actual} />
                                <Card
                                    label="Inscripción"
                                    value={selectedAlumno.inscripcion_pagada ? 'Pagada' : 'Pendiente'}
                                />
                                <Card
                                    label="Dirección"
                                    value={selectedAlumno.direccion || 'No registrada'}
                                    full
                                />

                                <div className="relative group overflow-hidden rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/[0.06] via-blue-500/[0.04] to-violet-500/[0.06] p-6 transition-all duration-300 hover:scale-[1.01] hover:border-cyan-300/40 md:col-span-2">
                                    <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
                                        <div className="absolute -top-10 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full bg-cyan-400/20 blur-3xl" />
                                    </div>

                                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-300/70">
                                        Representante
                                    </p>

                                    {selectedAlumno.representantes ? (
                                        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
                                            <Mini label="Nombres y apellidos">
                                                {selectedAlumno.representantes.nombres} {selectedAlumno.representantes.apellidos}
                                            </Mini>

                                            <Mini label="Parentesco">
                                                {selectedAlumno.representantes.parentesco || 'No registrado'}
                                            </Mini>

                                            <Mini label="Cédula">
                                                {selectedAlumno.representantes.cedula || 'No registrada'}
                                            </Mini>

                                            <Mini label="Teléfono">
                                                {selectedAlumno.representantes.telefono || 'No registrado'}
                                            </Mini>

                                            <Mini label="Correo" full>
                                                {selectedAlumno.representantes.correo || 'No registrado'}
                                            </Mini>

                                            <Mini label="Dirección" full>
                                                {selectedAlumno.representantes.direccion || 'No registrada'}
                                            </Mini>
                                        </div>
                                    ) : (
                                        <p className="mt-3 font-semibold text-white/80">Sin representante</p>
                                    )}
                                </div>

                                <Card
                                    label="Observaciones"
                                    value={selectedAlumno.observaciones || 'Sin observaciones'}
                                    full
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

function Card({
    label,
    value,
    full = false,
}: {
    label: string
    value: string
    full?: boolean
}) {
    return (
        <div
            className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(15,23,42,0.7))] p-5 transition-all duration-300 hover:scale-[1.02] hover:border-cyan-400/30 hover:bg-cyan-500/[0.05] hover:shadow-[0_0_30px_rgba(34,211,238,0.15)] ${full ? 'md:col-span-2' : ''}`}
        >
            <span className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
                <span className="absolute inset-0 bg-cyan-400/10 blur-2xl"></span>
            </span>

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300/70">
                {label}
            </p>

            <p className="mt-2 text-lg font-semibold text-white/90 tracking-wide">
                {value}
            </p>
        </div>
    )
}

function InputPro({
    icon,
    error,
    ...props
}: {
    icon: React.ReactNode
    error?: boolean
} & React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <div
            className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all duration-300 ${error
                ? 'border-red-400/40 bg-red-500/5'
                : 'border-white/10 bg-white/10 hover:bg-white/[0.08] focus-within:border-cyan-400/40 focus-within:bg-white/[0.12] focus-within:shadow-[0_0_25px_rgba(34,211,238,0.25)]'
                }`}
        >
            <div className="text-cyan-300">{icon}</div>

            <input
                {...props}
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-400"
            />
        </div>
    )
}

function Mini({
    label,
    children,
    full = false,
}: {
    label: string
    children: React.ReactNode
    full?: boolean
}) {
    return (
        <div
            className={`group relative rounded-2xl border border-white/5 bg-white/[0.03] p-4 transition-all duration-300 hover:border-violet-400/30 hover:bg-white/[0.06] ${full ? 'md:col-span-2' : ''
                }`}
        >
            <p className="text-[10px] uppercase tracking-[0.25em] text-violet-300/70 transition group-hover:text-violet-200">
                {label}
            </p>

            <p className="mt-2 font-semibold tracking-tight text-white transition group-hover:text-violet-100">
                {children}
            </p>

            <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.15),transparent_70%)] opacity-0 transition duration-300 group-hover:opacity-100" />
        </div>
    )
}