"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/panelnotas', label: 'Mis Notas' },
  { href: '/planes', label: 'Planes' },
];

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Cierra el menú móvil al navegar a otra página
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const linkClass = (href) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      pathname === href
        ? 'text-amber-400 bg-slate-800/60'
        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
    }`;

  return (
    <nav className="bg-slate-900/90 backdrop-blur-md text-white border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo / Título */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-lg sm:text-xl font-bold tracking-wider text-amber-400 flex items-center gap-2">
              <span className="text-amber-50 font-light">Logo</span>
              <span className="hidden xs:inline sm:inline">Organizador de notas</span>
            </Link>
          </div>

          {/* Menú Escritorio */}
          <div className="hidden md:flex items-center space-x-2">
            {LINKS.map(({ href, label }) => (
              <Link key={href} href={href} className={linkClass(href)}>
                {label}
              </Link>
            ))}

            <Link
              href="/crearnotas"
              className="bg-amber-500 hover:bg-amber-600 active:scale-[0.97] text-slate-900 px-4 py-2 rounded-md text-sm font-semibold transition-all shadow-md shadow-amber-500/10 ml-2"
            >
              + Nueva Nota
            </Link>

            {/* Avatar de Usuario */}
            <Link
              href="/perfil"
              title="Mi perfil"
              className={`w-9 h-9 ml-2 rounded-full border flex items-center justify-center text-sm font-semibold transition-colors ${
                pathname === '/perfil'
                  ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                  : 'bg-slate-700 border-slate-600 hover:border-amber-500/60 text-slate-300'
              }`}
            >
              👤
            </Link>
          </div>

          {/* Botón Menú Móvil */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none transition-colors"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Abrir menú</span>
              {isOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menú Móvil Desplegable (animado) */}
      <div
        id="mobile-menu"
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-slate-900 border-b border-slate-800 px-3 pt-2 pb-4 space-y-1">
          {[...LINKS, { href: '/perfil', label: 'Mi Perfil' }].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`block px-3 py-2.5 rounded-md text-base font-medium transition-colors ${
                pathname === href
                  ? 'text-amber-400 bg-slate-800/60'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {label}
            </Link>
          ))}

          <Link
            href="/crearnotas"
            className="block text-center bg-amber-500 hover:bg-amber-600 text-slate-900 px-4 py-2.5 rounded-md text-base font-semibold mt-3 transition-colors"
          >
            + Nueva Nota
          </Link>
        </div>
      </div>
    </nav>
  );
}
