"use client";

import { useMemo, useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toggleFavorite, deleteNote } from '../panelnotas/actions';

const TABS = [
  { key: 'todas', label: 'Todas' },
  { key: 'favoritas', label: 'Favoritas' },
  { key: 'compartidas', label: 'Compartidas' },
];

function NoteCard({ note, index, onToggleFavorite, onDelete }) {
  const [confirming, setConfirming] = useState(false);

  return (
    <div
      className="group relative flex flex-col justify-between bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 transition-all hover:shadow-lg hover:shadow-black/30 hover:-translate-y-1 duration-200 animate-fade-up"
      style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
    >
      <div>
        {/* Título, favorito y badge de compartida */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <Link href={`/notas/${note.id}`} className="min-w-0 flex-1">
            <h2 className="font-semibold text-lg text-slate-200 group-hover:text-amber-400 transition-colors line-clamp-1">
              {note.title || 'Sin título'}
            </h2>
          </Link>

          {note.shared ? (
            <span
              className="shrink-0 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2 py-0.5 rounded-full"
              title="Nota compartida contigo"
            >
              👥 Compartida
            </span>
          ) : (
            <button
              type="button"
              onClick={() => onToggleFavorite(note)}
              className={`shrink-0 text-lg leading-none transition-transform active:scale-75 hover:scale-110 ${
                note.is_favorite ? 'text-amber-400' : 'text-slate-600 hover:text-slate-400'
              }`}
              title={note.is_favorite ? 'Quitar de favoritas' : 'Marcar como favorita'}
              aria-label="Alternar favorita"
            >
              {note.is_favorite ? '⭐' : '☆'}
            </button>
          )}
        </div>

        {/* Contenido / Extracto */}
        <Link href={`/notas/${note.id}`} className="block">
          <p className="text-sm text-slate-400 line-clamp-3 mb-6 leading-relaxed">
            {note.content || 'Nota vacía...'}
          </p>
        </Link>
      </div>

      {/* Footer de la tarjeta */}
      <div className="flex items-center justify-between border-t border-slate-800/60 pt-3 mt-auto">
        <span className="text-xs text-slate-500">
          {new Date(note.updated_at).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
          })}
        </span>

        <div className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <Link
            href={`/notas/${note.id}`}
            className="text-xs px-2.5 py-1.5 rounded-md text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
          >
            Abrir
          </Link>
          {!note.shared && (
            confirming ? (
              <span className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onDelete(note)}
                  className="text-xs px-2.5 py-1.5 rounded-md bg-rose-600/20 text-rose-400 hover:bg-rose-600 hover:text-white transition-colors"
                >
                  Eliminar
                </button>
                <button
                  type="button"
                  onClick={() => setConfirming(false)}
                  className="text-xs px-2 py-1.5 rounded-md text-slate-500 hover:text-slate-300 transition-colors"
                >
                  No
                </button>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setConfirming(true)}
                className="text-xs px-2.5 py-1.5 rounded-md text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                title="Eliminar nota"
              >
                🗑
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default function NotesPanel({ notes, sharedNotes }) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [tab, setTab] = useState('todas');
  const [query, setQuery] = useState('');
  // Estado optimista local para favoritos y eliminaciones
  const [overrides, setOverrides] = useState({});
  const [removed, setRemoved] = useState({});

  const allNotes = useMemo(() => {
    const merged = [...notes, ...sharedNotes];
    return merged
      .filter((n) => !removed[n.id])
      .map((n) => (overrides[n.id] !== undefined ? { ...n, is_favorite: overrides[n.id] } : n));
  }, [notes, sharedNotes, overrides, removed]);

  const counts = useMemo(
    () => ({
      todas: allNotes.length,
      favoritas: allNotes.filter((n) => n.is_favorite && !n.shared).length,
      compartidas: allNotes.filter((n) => n.shared).length,
    }),
    [allNotes]
  );

  const visibleNotes = useMemo(() => {
    let list = allNotes;
    if (tab === 'favoritas') list = list.filter((n) => n.is_favorite && !n.shared);
    if (tab === 'compartidas') list = list.filter((n) => n.shared);

    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (n) =>
          (n.title || '').toLowerCase().includes(q) ||
          (n.content || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [allNotes, tab, query]);

  const handleToggleFavorite = (note) => {
    const next = !note.is_favorite;
    setOverrides((prev) => ({ ...prev, [note.id]: next }));
    startTransition(async () => {
      const res = await toggleFavorite(note.id, next);
      if (!res.ok) {
        setOverrides((prev) => ({ ...prev, [note.id]: !next }));
      }
      router.refresh();
    });
  };

  const handleDelete = (note) => {
    setRemoved((prev) => ({ ...prev, [note.id]: true }));
    startTransition(async () => {
      const res = await deleteNote(note.id);
      if (!res.ok) {
        setRemoved((prev) => ({ ...prev, [note.id]: false }));
      }
      router.refresh();
    });
  };

  return (
    <>
      {/* Encabezado del Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 animate-fade-up">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">Mis Notas</h1>
          <p className="text-sm text-slate-400 mt-1">Gestiona y organiza tus ideas diarias</p>
        </div>
        <Link
          href="/crearnotas"
          className="inline-flex items-center justify-center bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-slate-900 px-5 py-2.5 rounded-lg font-semibold transition-all shadow-md shadow-amber-500/10 text-sm gap-2"
        >
          <span className="text-base leading-none">+</span> Nueva Nota
        </Link>
      </div>

      {/* Buscador + Tabs */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-8 animate-fade-up" style={{ animationDelay: '60ms' }}>
        <div className="relative flex-1 max-w-full md:max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 text-sm">
            🔍
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por título o contenido..."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1 self-start md:self-auto overflow-x-auto max-w-full">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`px-3.5 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-all ${
                tab === key
                  ? 'bg-amber-500 text-slate-900 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {label}
              <span className={`ml-1.5 text-xs ${tab === key ? 'text-slate-800' : 'text-slate-600'}`}>
                {counts[key]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Notas o Estado Vacío */}
      {visibleNotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-xl p-12 text-center bg-slate-900/50 animate-fade-up">
          <span className="text-4xl mb-4">
            {tab === 'favoritas' ? '⭐' : tab === 'compartidas' ? '👥' : '📭'}
          </span>
          <h3 className="text-lg font-medium text-slate-300">
            {query
              ? 'Sin resultados para tu búsqueda'
              : tab === 'favoritas'
              ? 'Aún no tienes notas favoritas'
              : tab === 'compartidas'
              ? 'Nadie ha compartido notas contigo'
              : 'No hay notas todavía'}
          </h3>
          <p className="text-sm text-slate-500 max-w-sm mt-1 mb-6">
            {query
              ? 'Prueba con otras palabras clave o revisa otra pestaña.'
              : tab === 'favoritas'
              ? 'Toca la estrella ☆ de cualquier nota para tenerla siempre a mano.'
              : tab === 'compartidas'
              ? 'Cuando otro usuario comparta una nota contigo aparecerá aquí.'
              : 'Comienza creando tu primera nota para no olvidar tus pensamientos importantes.'}
          </p>
          {!query && tab === 'todas' && (
            <Link
              href="/crearnotas"
              className="text-amber-400 hover:text-amber-300 font-medium text-sm transition-colors"
            >
              Crear una nota ahora →
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {visibleNotes.map((note, index) => (
            <NoteCard
              key={`${note.id}-${note.shared ? 's' : 'p'}`}
              note={note}
              index={index}
              onToggleFavorite={handleToggleFavorite}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </>
  );
}
