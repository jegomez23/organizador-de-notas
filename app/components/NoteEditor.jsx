"use client";

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  updateNote,
  toggleFavorite,
  deleteNote,
  shareNote,
  unshareNote,
} from '../panelnotas/actions';

export default function NoteEditor({ note, isOwner, collaborators }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState(note.title || '');
  const [content, setContent] = useState(note.content || '');
  const [isFavorite, setIsFavorite] = useState(note.is_favorite);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  const [shareEmail, setShareEmail] = useState('');
  const [shareMsg, setShareMsg] = useState(null);
  const [sharing, setSharing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const hasChanges =
    title !== (note.title || '') || content !== (note.content || '');

  const handleSave = () => {
    setError(null);
    setSaved(false);
    startTransition(async () => {
      const res = await updateNote(note.id, { title, content });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      router.refresh();
    });
  };

  const handleFavorite = () => {
    const next = !isFavorite;
    setIsFavorite(next);
    startTransition(async () => {
      const res = await toggleFavorite(note.id, next);
      if (!res.ok) setIsFavorite(!next);
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      const res = await deleteNote(note.id);
      if (res.ok) {
        router.push('/panelnotas');
      } else {
        setError(res.error);
      }
    });
  };

  const handleShare = async (e) => {
    e.preventDefault();
    if (!shareEmail.trim()) return;
    setSharing(true);
    setShareMsg(null);
    const res = await shareNote(note.id, shareEmail);
    setSharing(false);
    if (res.ok) {
      setShareMsg({ type: 'ok', text: `Nota compartida con ${shareEmail.trim()}.` });
      setShareEmail('');
      router.refresh();
    } else {
      setShareMsg({ type: 'error', text: res.error });
    }
  };

  const handleUnshare = (shareId) => {
    startTransition(async () => {
      await unshareNote(shareId, note.id);
      router.refresh();
    });
  };

  return (
    <div className="animate-fade-up">
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
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 truncate">
            {isOwner ? 'Editar Nota' : 'Nota compartida'}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Última edición:{' '}
            {new Date(note.updated_at).toLocaleString('es-ES', {
              dateStyle: 'long',
              timeStyle: 'short',
            })}
          </p>
        </div>

        <button
          type="button"
          onClick={handleFavorite}
          className={`shrink-0 text-2xl transition-transform active:scale-75 hover:scale-110 ${
            isFavorite ? 'text-amber-400' : 'text-slate-600 hover:text-slate-400'
          }`}
          title={isFavorite ? 'Quitar de favoritas' : 'Marcar como favorita'}
        >
          {isFavorite ? '⭐' : '☆'}
        </button>
      </div>

      {!isOwner && (
        <div className="mb-6 bg-sky-950/40 border border-sky-800/50 text-sky-300 text-sm p-4 rounded-lg flex items-center gap-2 animate-fade-up">
          <span>👥</span> Esta nota fue compartida contigo. Los cambios que guardes serán visibles para todos.
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-950/40 border border-red-800/60 text-red-400 text-sm p-4 rounded-lg flex items-center gap-2">
          <span>⚠️</span> {error}
        </div>
      )}

      {/* Editor */}
      <div className="space-y-6 bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-xl">
        <div>
          <label htmlFor="title" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Título
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Contenido
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={12}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors resize-y leading-relaxed"
          />
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center sm:justify-between gap-3 pt-4 border-t border-slate-800/60">
          {isOwner ? (
            confirmingDelete ? (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-400">¿Eliminar definitivamente?</span>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isPending}
                  className="px-3 py-1.5 rounded-md bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors"
                >
                  Sí, eliminar
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmingDelete(false)}
                  className="px-3 py-1.5 rounded-md text-slate-400 hover:text-slate-200 text-xs transition-colors"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmingDelete(true)}
                className="text-sm text-slate-500 hover:text-rose-400 transition-colors text-left"
              >
                🗑 Eliminar nota
              </button>
            )
          ) : (
            <span />
          )}

          <div className="flex items-center justify-end gap-3">
            {saved && (
              <span className="text-xs text-emerald-400 animate-fade-up">✓ Guardado</span>
            )}
            <button
              type="button"
              onClick={handleSave}
              disabled={isPending || !hasChanges}
              className="bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/40 disabled:cursor-not-allowed active:scale-[0.98] text-slate-900 px-6 py-2.5 rounded-lg font-semibold transition-all shadow-md text-sm"
            >
              {isPending ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </div>
      </div>

      {/* Sección de colaboración (solo el dueño puede compartir) */}
      <div className="mt-6 bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-xl animate-fade-up" style={{ animationDelay: '80ms' }}>
        <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2 mb-1">
          👥 Colaboradores
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          {isOwner
            ? 'Comparte esta nota con otros usuarios para editarla en conjunto.'
            : 'Personas con acceso a esta nota.'}
        </p>

        {isOwner && (
          <form onSubmit={handleShare} className="flex flex-col sm:flex-row gap-2 mb-4">
            <input
              type="email"
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
              required
            />
            <button
              type="submit"
              disabled={sharing}
              className="bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors border border-slate-700"
            >
              {sharing ? 'Compartiendo...' : 'Compartir'}
            </button>
          </form>
        )}

        {shareMsg && (
          <p
            className={`text-xs mb-4 animate-fade-up ${
              shareMsg.type === 'ok' ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {shareMsg.type === 'ok' ? '✓ ' : '⚠️ '}
            {shareMsg.text}
          </p>
        )}

        {collaborators.length === 0 ? (
          <p className="text-xs text-slate-600 italic">
            Esta nota aún no se ha compartido con nadie.
          </p>
        ) : (
          <ul className="divide-y divide-slate-800/60">
            {collaborators.map((c) => (
              <li key={c.share_id} className="flex items-center justify-between gap-3 py-2.5">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-8 h-8 shrink-0 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-amber-400 uppercase">
                    {(c.full_name || c.email || '?').charAt(0)}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm text-slate-300 truncate">{c.full_name || 'Usuario'}</p>
                    <p className="text-xs text-slate-500 truncate">{c.email}</p>
                  </div>
                </div>
                {isOwner && (
                  <button
                    type="button"
                    onClick={() => handleUnshare(c.share_id)}
                    disabled={isPending}
                    className="text-xs text-slate-500 hover:text-rose-400 transition-colors shrink-0"
                  >
                    Quitar
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
