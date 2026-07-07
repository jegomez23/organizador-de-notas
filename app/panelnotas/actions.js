'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '../utils/supabase/server';

// Marca o desmarca una nota como favorita
export async function toggleFavorite(noteId, isFavorite) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('notes')
    .update({ is_favorite: isFavorite, updated_at: new Date().toISOString() })
    .eq('id', noteId);

  if (error) return { ok: false, error: error.message };

  revalidatePath('/panelnotas');
  revalidatePath(`/notas/${noteId}`);
  return { ok: true };
}

// Actualiza título y contenido de una nota (dueño o colaborador con edición)
export async function updateNote(noteId, { title, content }) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('notes')
    .update({
      title: (title || '').trim() || 'Sin título',
      content: (content || '').trim(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', noteId);

  if (error) return { ok: false, error: error.message };

  revalidatePath('/panelnotas');
  revalidatePath(`/notas/${noteId}`);
  return { ok: true };
}

// Elimina una nota (solo el dueño, protegido por RLS)
export async function deleteNote(noteId) {
  const supabase = await createClient();

  const { error } = await supabase.from('notes').delete().eq('id', noteId);

  if (error) return { ok: false, error: error.message };

  revalidatePath('/panelnotas');
  return { ok: true };
}

// Comparte una nota con otro usuario por correo (RPC en Supabase)
export async function shareNote(noteId, email) {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc('share_note_with_email', {
    p_note_id: noteId,
    p_email: email,
  });

  if (error) return { ok: false, error: error.message };
  if (data && data.ok === false) return { ok: false, error: data.error };

  revalidatePath(`/notas/${noteId}`);
  return { ok: true };
}

// Quita a un colaborador de una nota
export async function unshareNote(shareId, noteId) {
  const supabase = await createClient();

  const { error } = await supabase.from('note_shares').delete().eq('id', shareId);

  if (error) return { ok: false, error: error.message };

  revalidatePath('/panelnotas');
  revalidatePath(`/notas/${noteId}`);
  return { ok: true };
}
