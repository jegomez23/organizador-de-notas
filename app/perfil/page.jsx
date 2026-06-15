import { redirect } from 'next/navigation';
import { createClient } from '../utils/supabase/server';

// Función de backend para validar la sesión y traer los datos del perfil
async function getProfileData() {
  const supabase = await createClient();

  // 1. Obtener el usuario autenticado desde las cookies de sesión de forma segura
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  // Si no hay usuario o el token expiró, redirigimos al login
  if (authError || !user) {
    return redirect('/login');
  }

  // 2. Consultar la tabla pública de perfiles usando el ID del usuario autenticado
  const { data: profile, error: dbError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single(); // .single() asegura que devuelva un objeto en vez de un array

  if (dbError) {
    console.error('Error al obtener el perfil de la base de datos:', dbError.message);
    // Retornamos un objeto básico con el email de auth si la tabla profiles falla
    return {
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name || 'Usuario sin nombre',
      avatar_url: null,
    };
  }

  return profile;
}

export default async function PerfilPage() {
  // Ejecutamos la lógica de servidor
  const profile = await getProfileData();

  // Server Action para cerrar sesión (Backend)
  const handleSignOut = async () => {
    'use server';
    const supabaseServer = await createClient();
    await supabaseServer.auth.signOut();
    return redirect('/login');
  };

  // Obtener la inicial del nombre para el avatar por defecto
  const inicialNombre = profile.full_name ? profile.full_name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        
        {/* Decoración sutil de fondo */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-amber-500/10 to-transparent border-b border-slate-800/40" />

        {/* Encabezado del Perfil e Imagen */}
        <div className="relative flex flex-col sm:flex-row items-center gap-4 mb-8 pt-4">
          {profile.avatar_url ? (
            <img 
              src={profile.avatar_url} 
              alt={profile.full_name} 
              className="w-20 h-20 rounded-full border-2 border-amber-500 object-cover bg-slate-950 shadow-md"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-2xl font-black text-amber-400 shadow-md">
              {inicialNombre}
            </div>
          )}
          
          <div className="text-center sm:text-left mt-2 sm:mt-0">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-100">{profile.full_name}</h1>
            <p className="text-xs text-slate-400 mt-0.5">ID: {profile.id}</p>
          </div>
        </div>

        {/* Listado de Datos del Usuario */}
        <div className="space-y-5">
          
          {/* Campo Correo */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Correo Electrónico
            </label>
            <div className="w-full bg-slate-950/60 border border-slate-800/80 rounded-lg px-4 py-2.5 text-sm text-slate-300">
              {profile.email}
            </div>
          </div>

          {/* Campo Nombre Completo */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Nombre Completo
            </label>
            <div className="w-full bg-slate-950/60 border border-slate-800/80 rounded-lg px-4 py-2.5 text-sm text-slate-300">
              {profile.full_name}
            </div>
          </div>

          {/* Campo Última Actualización */}
          {profile.updated_at && (
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Última sincronización
              </label>
              <div className="w-full bg-slate-950/60 border border-slate-800/80 rounded-lg px-4 py-2.5 text-sm text-slate-400 flex items-center gap-2">
                <span>🔄</span> {new Date(profile.updated_at).toLocaleString('es-ES', {
                  dateStyle: 'long',
                  timeStyle: 'short'
                })}
              </div>
            </div>
          )}

        </div>

        {/* Acciones del Perfil */}
        <div className="mt-8 pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 text-center sm:text-left">
            Tus datos están protegidos mediante cifrado SSL por Supabase.
          </p>
          
          {/* Formulario que ejecuta la Server Action de Logout */}
          <form action={handleSignOut} className="w-full sm:w-auto">
            <button 
              type="submit" 
              className="w-full sm:w-auto bg-rose-600/10 hover:bg-rose-600 border border-rose-600/30 hover:border-rose-600 text-rose-400 hover:text-white py-2 px-5 rounded-lg text-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <span>🚪</span> Cerrar Sesión
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
