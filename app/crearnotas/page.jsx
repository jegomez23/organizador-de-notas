"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase'; // Asegúrate de tener configurado tu cliente de Supabase

export default function CrearNotaPage() {
  const router = useRouter();
  
  // Estados para el formulario
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Obtener el usuario actual autenticado
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('Debes iniciar sesión para crear una nota.');
      }

      // 2. Insertar la nueva nota en Supabase
      const { error: insertError } = await supabase
        .from('notes')
        .insert([
          {
            title: title.trim() || 'Sin título',
            content: content.trim(),
            is_favorite: isFavorite,
            user_id: user.id // Vinculación requerida por las políticas RLS
          }
        ]);

      if (insertError) throw insertError;

      // 3. Redireccionar al panel principal de notas y refrescar los datos
      router.push('/panelnotas');
      router.refresh();

    } catch (err) {
      setError(err.message || 'Ocurrió un error al guardar la nota.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Botón de regreso */}
        <div className="mb-6">
          <Link 
            href="/panelnotas" 
            className="text-sm text-slate-400 hover:text-amber-400 transition-colors inline-flex items-center gap-2"
          >
            ← Volver a mis notas
          </Link>
        </div>

        {/* Encabezado */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">Nueva Nota</h1>
          <p className="text-sm text-slate-400 mt-1">Escribe y captura tus ideas al instante</p>
        </div>

        {/* Mensaje de Error */}
        {error && (
          <div className="mb-6 bg-red-950/40 border border-red-800/60 text-red-400 text-sm p-4 rounded-lg flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
          
          {/* Título de la nota */}
          <div>
            <label htmlFor="title" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Título de la nota
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Ideas para el proyecto o Lista de compras..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
              required
            />
          </div>

          {/* Opción Favorito */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setIsFavorite(!isFavorite)}
              className="flex items-center gap-2 text-sm text-slate-300 hover:text-slate-100 transition-colors select-none"
            >
              <span className={`text-xl transition-transform active:scale-95 ${isFavorite ? 'text-amber-400' : 'text-slate-600'}`}>
                {isFavorite ? '⭐' : '☆'}
              </span>
              Marcar como nota favorita
            </button>
          </div>

          {/* Contenido de la nota */}
          <div>
            <label htmlFor="content" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Contenido
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Comienza a escribir aquí..."
              rows={10}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors resize-y leading-relaxed"
            />
          </div>

          {/* Botones de acción */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-800/60">
            <Link
              href="/panelnotas"
              className="px-4 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/50 disabled:cursor-not-allowed text-slate-900 px-6 py-2.5 rounded-lg font-semibold transition-colors shadow-md text-sm flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-slate-900" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Guardando...
                </>
              ) : (
                'Guardar Nota'
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
