"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
// Corregimos la ruta relativa exacta hacia tu cliente del navegador
import { supabase } from '@/lib/supabase';


export default function Register() {
  const router = useRouter();
  const [fullName, setFullName] = useState(""); // Nuevo estado para aprovechar tu Trigger SQL
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  async function handleRegister(e) {
    e.preventDefault(); // Previene que la página se recargue
    setLoading(true);
    setMessage({ text: "", type: "" });

    // Registramos al usuario enviando metadatos para el Disparador (Trigger) SQL
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Tu Trigger de Postgres leerá este campo de forma automática
        data: {
          full_name: fullName || "Nuevo Usuario",
        },
      },
    });

    setLoading(false);

    if (error) {
      setMessage({ text: error.message, type: "error" });
      return;
    }

    if (data?.user) {
      setMessage({ 
        text: "¡Registro exitoso! Verifica tu correo electrónico para confirmar tu cuenta.", 
        type: "success" 
      });
      
      // Limpiamos los campos del formulario
      setFullName("");
      setEmail("");
      setPassword("");

      // Opcional: Redirigir al login tras unos segundos
      setTimeout(() => {
        router.push("/login");
      }, 4000);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 text-slate-100">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl">
        
        <h1 className="text-3xl font-black text-center mb-2">Crear Cuenta</h1>
        <p className="text-sm text-slate-400 text-center mb-6">Regístrate para empezar a guardar tus notas</p>

        {/* Mensajes de feedback visual */}
        {message.text && (
          <div className={`p-3 rounded-lg mb-6 text-sm border text-center ${
            message.type === "success" 
              ? "bg-emerald-950/50 border-emerald-800 text-emerald-400" 
              : "bg-rose-950/50 border-rose-800 text-rose-400"
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Nombre Completo</label>
            <input  
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors"
              placeholder="Juan Pérez"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Correo Electrónico</label>
            <input  
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors"
              placeholder="correo@ejemplo.com"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Contraseña</label>
            <input 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors"
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-800 disabled:cursor-not-allowed text-slate-950 font-bold p-3.5 rounded-xl transition-colors shadow-md text-sm"
          >
            {loading ? "Registrando..." : "Crear cuenta"}
          </button>
        </form>

      </div>
    </div>
  );
}
