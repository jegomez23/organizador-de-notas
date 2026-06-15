import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        // Método moderno para leer todas las cookies en bloque
        getAll() {
          return cookieStore.getAll();
        },
        // Método moderno para escribir cookies de sesión de forma segura
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Este bloque catch previene errores si se invoca desde un Server Component nativo
          }
        },
      },
    }
  );
}
