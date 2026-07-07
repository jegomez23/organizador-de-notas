import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "./components/NavBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "Organizador de Notas",
    template: "%s | Organizador de Notas",
  },
  description:
    "Aplicación de notas segura y minimalista: favoritas, colaboración y búsqueda instantánea.",
};

export const viewport = {
  themeColor: "#020617",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-950">
        <NavBar />
        <main className="flex-1">{children}</main>
        {/* FOOTER */}
        <footer className="border-t border-slate-900 py-8 text-center text-xs text-slate-600">
          <p>© {new Date().getFullYear()}</p>
          <p>hecho por JUAN ESTEBAN GOMEZ Developer FULLSTACK</p>
        </footer>
      </body>
    </html>
  );
}
