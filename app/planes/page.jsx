"use client";

export default function planes() {

  async function buy(priceId) {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        priceId,
      }),
    });

    const data = await res.json();
    console.log("RESPUESTA API:", data);

    window.location.href = data.url;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center">
      <div className="max-w-6xl w-full mx-auto">
        
        {/* Encabezado */}
        <div className="text-center mb-12 flex flex-col gap-4">
          <h1 className="text-3xl sm:text-5xl font-black text-slate-100 mt-2 tracking-tight">
            Escoge el mejor plan para ti
          </h1>
          <p className="text-sm sm:text-base text-slate-400 mt-3 max-w-md mx-auto">
            Desbloquea almacenamiento ilimitado y funciones avanzadas para tus notas.
          </p>
        </div>

        {/* Contenedor de Tarjetas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto mt-20">
          
          {/* PLAN BASIC */}
          <div className="flex flex-col justify-between p-6 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all shadow-xl text-center relative group">
            <div>
            
              <h2 className="text-xl font-bold text-slate-200">Plan Básico</h2>
              <p className="text-sm text-slate-400 mt-2 min-h-[40px]">
               Desbloquea 5 notas como maximo...
              </p>
            </div>
            
            <button 
              className="mt-8 bg-slate-800 hover:bg-slate-700 text-slate-200 w-full py-3 rounded-lg text-sm font-semibold transition-colors border border-slate-700" 
              onClick={() => buy(process.env.NEXT_PUBLIC_BASIC_PRICE)}
            >
              Comprar Basic
            </button>
          </div>

          {/* PLAN STANDARD (Destacado) */}
          <div className="flex flex-col justify-between p-6 rounded-xl bg-slate-900 border-2 border-amber-500/80 transition-all shadow-2xl shadow-amber-500/5 text-center relative group md:-translate-y-2">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              En Promo!
            </span>
            <div>
             
              <h2 className="text-xl font-bold text-slate-100">Plan Estándar</h2>
              <p className="text-sm text-slate-400 mt-2 min-h-[40px]">
                Perfecto para estudiantes y profesionales que buscan productividad. Desbloqueas 50 notas
              </p>
            </div>
            
            <button 
              className="mt-8 bg-amber-500 hover:bg-amber-600 text-slate-900 w-full py-3 rounded-lg text-sm font-semibold transition-colors shadow-md" 
              onClick={() => buy(process.env.NEXT_PUBLIC_STANDARD_PRICE)}
            >
              Comprar Standard
            </button>
          </div>

          {/* PLAN PREMIUM */}
          <div className="flex flex-col justify-between p-6 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all shadow-xl text-center relative group">
            <div>
              
              <h2 className="text-xl font-bold text-slate-200">Plan Premium</h2>
              <p className="text-sm text-slate-400 mt-2 min-h-[40px]">
               Ideal para gestionar proyectos grandes e ideas. desbloqueas notas ilimitadas
              </p>
            </div>
            
            <button 
              className="mt-8 bg-slate-800 hover:bg-slate-700 text-slate-200 w-full py-3 rounded-lg text-sm font-semibold transition-colors border border-slate-700" 
              onClick={() => buy(process.env.NEXT_PUBLIC_PREMIUM_PRICE)}
            >
              Comprar Premium
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
