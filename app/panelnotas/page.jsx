import { redirect } from 'next/navigation';
import { createClient } from '../utils/supabase/server';
import NotesPanel from '../components/NotesPanel';

// Obtiene las notas propias y las compartidas con el usuario actual
async function getNotesData() {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    redirect('/login');
  }

  // Notas propias
  const { data: ownNotes, error } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error cargando notas:', error.message);
  }

  // Notas compartidas conmigo (si la tabla note_shares aún no existe, se ignora)
  let sharedNotes = [];
  const { data: shares, error: sharesError } = await supabase
    .from('note_shares')
    .select('id, can_edit, notes(*)')
    .eq('shared_with', user.id);

  if (!sharesError && shares) {
    sharedNotes = shares
      .filter((s) => s.notes)
      .map((s) => ({ ...s.notes, shared: true, can_edit: s.can_edit }))
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
  }

  return { notes: ownNotes || [], sharedNotes, userId: user.id };
}

export const metadata = {
  title: 'Mis Notas',
};

export default async function MisNotasPage() {
  const { notes, sharedNotes } = await getNotesData();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <NotesPanel notes={notes} sharedNotes={sharedNotes} />
      </div>
    </div>
  );
}
