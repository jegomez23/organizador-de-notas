import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-slate-950">
      
      {/* SECCIÓN HERO (Principal) */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 flex flex-col items-center text-center overflow-hidden">
        {/* Luces de fondo decorativas */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />
        
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-6 animate-pulse">
           Organiza tus ideas
        </span>
        
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight max-w-3xl leading-tight">
          Captura tus ideas antes de que <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">se desvanezcan</span>
        </h1>
        
        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-xl leading-relaxed">
          Una aplicación de notas segura y minimalista diseñada para potenciar tu productividad diaria.
        </p>

        {/* Botones de Acción Principal */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link 
            href="/panelnotas" 
            className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-slate-900 px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-amber-500/10 text-center"
          >
            Ir a Mis Notas
          </Link>
          <Link 
            href="/login" 
            className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 px-8 py-3.5 rounded-xl font-semibold transition-all text-center"
          >
            Iniciar Sesión
          </Link>
        </div>
      </section>



      {/* MAPA DE RUTAS / ACCESOS RÁPIDOS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
          Explora la Aplicación
        </h2>
        <p className="text-sm text-slate-400 mb-10 max-w-md mx-auto">
          Accede directamente a cualquier sección de tu espacio de trabajo desde este panel centralizado.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          
          <Link href="/panelnotas" className="p-4 bg-slate-900 border border-slate-800/60 rounded-xl hover:border-amber-500/40 hover:bg-slate-900/80 transition-all group">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 group-hover:text-amber-400">Mis Notas</span>
          </Link>

          <Link href="/crearnotas" className="p-4 bg-slate-900 border border-slate-800/60 rounded-xl hover:border-amber-500/40 hover:bg-slate-900/80 transition-all group">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 group-hover:text-amber-400">Crear Nota</span>
          </Link>

          <Link href="/planes" className="p-4 bg-slate-900 border border-slate-800/60 rounded-xl hover:border-amber-500/40 hover:bg-slate-900/80 transition-all group">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 group-hover:text-amber-400">Planes Premium</span>
          </Link>

          <Link href="/perfil" className="p-4 bg-slate-900 border border-slate-800/60 rounded-xl hover:border-amber-500/40 hover:bg-slate-900/80 transition-all group">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 group-hover:text-amber-400">Mi Perfil</span>
          </Link>

          <Link href="/login" className="p-4 bg-slate-900 border border-slate-800/60 rounded-xl hover:border-amber-500/40 hover:bg-slate-900/80 transition-all group">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 group-hover:text-amber-400">Iniciar Sesión</span>
          </Link>

          <Link href="/register" className="p-4 bg-slate-900 border border-slate-800/60 rounded-xl hover:border-amber-500/40 hover:bg-slate-900/80 transition-all group">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 group-hover:text-amber-400">Registrarse</span>
          </Link>

        </div>
      </section>

     

    </div>
  );
}
