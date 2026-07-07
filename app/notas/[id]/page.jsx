import { redirect, notFound } from 'next/navigation';
import { createClient } from '../../utils/supabase/server';
import NoteEditor from '../../components/NoteEditor';

export const metadata = {
  title: 'Editar Nota',
};

export default async function NotaPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    redirect('/login');
  }

  // RLS permite ver la nota si es propia o compartida con el usuario
  const { data: note, error } = await supabase
    .from('notes')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !note) {
    notFound();
  }

  const isOwner = note.user_id === user.id;

  // Colaboradores (la RPC valida permisos; si la migración no está aplicada, lista vacía)
  let collaborators = [];
  const { data: collabData, error: collabError } = await supabase.rpc(
    'get_note_collaborators',
    { p_note_id: id }
  );
  if (!collabError && collabData) {
    collaborators = collabData;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <NoteEditor note={note} isOwner={isOwner} collaborators={collaborators} />
      </div>
    </div>
  );
}
