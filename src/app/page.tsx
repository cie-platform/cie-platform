'use client'
import { useState, useEffect } from 'react'
import { supabase } from './supabase'

export default function RegistroAlumnos() {
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [alumnos, setAlumnos] = useState<any[]>([])

  // 1. Función para traer los alumnos de la nube
  async function obtenerAlumnos() {
    const { data } = await supabase.from('alumnos').select('*').order('id', { ascending: false })
    if (data) setAlumnos(data)
  }

  // 2. Se ejecuta al abrir la página
  useEffect(() => {
    obtenerAlumnos()
  }, [])

  async function guardarAlumno(e: React.FormEvent) {
    e.preventDefault()
    const { error } = await supabase
      .from('alumnos')
      .insert([{ nombres: nombre, apellidos: apellido }])

    if (error) alert('Error: ' + error.message)
    else {
      alert('✅ ¡Alumno registrado!')
      setNombre(''); setApellido('')
      obtenerAlumnos() // Refresca la lista automáticamente
    }
  }

  return (
    <main className="flex min-h-screen flex-col bg-gray-900 text-white p-8">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-700 mb-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-400">Registro de Alumnos CIE</h1>
        <form onSubmit={guardarAlumno} className="space-y-4">
          <input
            type="text" value={nombre} onChange={(e) => setNombre(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 outline-none focus:border-blue-500"
            placeholder="Nombres" required
          />
          <input
            type="text" value={apellido} onChange={(e) => setApellido(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 outline-none focus:border-blue-500"
            placeholder="Apellidos" required
          />
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-lg font-bold transition-colors">
            Guardar Alumno
          </button>
        </form>
      </div>

      {/* TABLA DE RESULTADOS */}
      <div className="w-full max-w-2xl bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-700 text-blue-400">
            <tr>
              <th className="p-4">Nombre</th>
              <th className="p-4">Apellido</th>
            </tr>
          </thead>
          <tbody>
            {alumnos.map((alum) => (
              <tr key={alum.id} className="border-t border-gray-700 hover:bg-gray-750">
                <td className="p-4">{alum.nombres}</td>
                <td className="p-4">{alum.apellidos}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}