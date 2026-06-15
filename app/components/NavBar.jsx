"use client"

import { useState } from 'react';
import Link from 'next/link';

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo / Título */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-xl font-bold tracking-wider text-amber-400 flex items-center gap-2">
              <span className='text-amber-50 font-light mr-8'>Logo</span> Organizador de notas
            </Link>
          </div>

          {/* Menú Escritorio */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/planes" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-800 transition-colors">
               Planes
            </Link>
             <Link href="/panelnotas" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-800 transition-colors">
              Mis Notas
            </Link>
          
            <Link href="/crearnotas" className="bg-amber-500 hover:bg-amber-600 text-slate-900 px-4 py-2 rounded-md text-sm font-semibold transition-colors shadow-md">
              + Nueva Nota
            </Link>
            
            {/* Avatar de Usuario */}
                  <Link href="/perfil"  className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center cursor-pointer text-sm font-semibold" >
            </Link>
            
          </div>

          {/* Botón Menú Móvil */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded="false"
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

      {/* Menú Móvil Desplegable */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden bg-slate-900 border-b border-slate-800 px-2 pt-2 pb-4 space-y-1 sm:px-3`}>
        <Link href="/notas" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-slate-800">
          Mis Notas
        </Link>
      
        <Link href="/notas/crear" className="block text-center bg-amber-500 text-slate-900 px-4 py-2 rounded-md text-base font-semibold mt-4">
          + Nueva Nota
        </Link>
      </div>
    </nav>
  );
}
