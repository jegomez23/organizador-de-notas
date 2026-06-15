import Link from 'next/link';
// 1. Ruta relativa corregida hacia la carpeta utils
import { createClient } from '../utils/supabase/server';

// Función para obtener las notas directamente desde Supabase en el servidor
async function getNotes() {
  // Inicializamos el cliente esperando las cookies de la sesión actual
  const supabase = await createClient();

  const { data: notes, error } = await supabase
    .from('notes')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error cargando notas:', error.message);
    return [];
  }
  
  return notes || [];
}

export default async function MisNotasPage() {
  const notes = await getNotes();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Encabezado del Panel */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">Mis Notas</h1>
            <p className="text-sm text-slate-400 mt-1">Gestiona y organiza tus ideas diarias</p>
          </div>
          <Link 
            href="/crearnotas" 
            className="inline-flex items-center justify-center bg-amber-500 hover:bg-amber-600 text-slate-900 px-5 py-2.5 rounded-lg font-semibold transition-colors shadow-md text-sm gap-2"
          >
            <span>+</span> Nueva Nota
          </Link>
        </div>

        {/* Buscador de Notas */}
        <div className="mb-8 max-w-md">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
              🔍
            </span>
            <input
              type="text"
              placeholder="Buscar notas..."
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
            />
          </div>
        </div>

        {/* Grid de Notas o Estado Vacío */}
        {notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-xl p-12 text-center bg-slate-900/50">
            <span className="text-4xl mb-4">📭</span>
            <h3 className="text-lg font-medium text-slate-300">No hay notas todavía</h3>
            <p className="text-sm text-slate-500 max-w-sm mt-1 mb-6">
              Comienza creando tu primera nota para no olvidar tus pensamientos importantes.
            </p>
            <Link 
              href="/notas/crear" 
              className="text-amber-400 hover:text-amber-300 font-medium text-sm transition-colors"
            >
              Crear una nota ahora →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <div 
                key={note.id} 
                className="group relative flex flex-col justify-between bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 transition-all hover:shadow-lg hover:-translate-y-0.5 duration-200"
              >
                <div>
                  {/* Título y Favorito */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h2 className="font-semibold text-lg text-slate-200 group-hover:text-amber-400 transition-colors line-clamp-1">
                      {note.title || 'Sin título'}
                    </h2>
                    {note.is_favorite && (
                      <span className="text-amber-400 text-sm" title="Favorita">⭐</span>
                    )}
                  </div>
                  
                  {/* Contenido / Extracto */}
                  <p className="text-sm text-slate-400 line-clamp-3 mb-6 leading-relaxed">
                    {note.content || 'Nota vacía...'}
                  </p>
                </div>

                {/* Footer de la tarjeta */}
                <div className="flex items-center justify-between border-t border-slate-800/60 pt-4 mt-auto">
                  <span className="text-xs text-slate-500">
                    {new Date(note.updated_at).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                    })}
                  </span>
                 
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
