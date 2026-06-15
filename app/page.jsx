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



     
      <section className="relative max-w-3xl mx-auto px-4 sm:px-6 py-24">

        <div className="flex items-center gap-4 mb-16">
          <div className="flex-1 h-px bg-white/5" />
          <div className="flex-1 h-px bg-white/5" />
        </div>

        <div className="mb-10">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Explora la Aplicación
          </h2>
          <p className="text-sm text-slate-500 mt-2 max-w-sm">
            Accede directamente a cualquier sección de tu espacio de trabajo desde este panel centralizado.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { href: '/panelnotas',  label: 'Mis Notas',       desc: 'Tu colección completa' },
            { href: '/crearnotas', label: 'Crear Nota',       desc: 'Nueva entrada' },
            { href: '/planes',     label: 'Planes Premium',   desc: 'Desbloquea más' },
            { href: '/perfil',     label: 'Mi Perfil',        desc: 'Ajustes de cuenta' },
            { href: '/login',      label: 'Iniciar Sesión',   desc: 'Accede ahora' },
            { href: '/register',   label: 'Registrarse',      desc: 'Comienza gratis' },
          ].map(({ href, label, desc }) => (
            <Link
              key={href}
              href={href}
              className="group relative p-5 bg-[#0C0E14] border border-white/6 rounded-2xl hover:border-amber-500/30 hover:bg-[#0F1117] transition-all duration-200 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-amber-500/0 group-hover:from-amber-500/5 group-hover:to-transparent transition-all duration-300 rounded-2xl" />
              <span className="block text-xs font-black uppercase tracking-widest text-slate-200 group-hover:text-amber-400 transition-colors duration-200 mb-1">
                {label}
              </span>
              <span className="block text-[11px] text-slate-600 group-hover:text-slate-500 transition-colors duration-200">
                {desc}
              </span>
              <svg
                className="absolute bottom-4 right-4 w-3.5 h-3.5 text-slate-700 group-hover:text-amber-500/60 transition-all duration-200 translate-x-0 group-hover:translate-x-0.5"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          ))}
        </div>
      </section>

     

    </div>
  );
}
