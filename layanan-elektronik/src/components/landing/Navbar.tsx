import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Wrench } from "lucide-react";

const navLinks = [
  { href: "#layanan", label: "Layanan" },
  { href: "#keunggulan", label: "Fitur" },
  { href: "#testimoni", label: "Ulasan" },
] as const;

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-zinc-200/50 transition-all duration-300">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <Wrench className="w-5 h-5 text-zinc-900 group-hover:rotate-12 transition-transform duration-300" />
          <span className="text-xl font-semibold text-zinc-900 tracking-tight">FixIt</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[13px] font-medium text-zinc-500 hover:text-zinc-900 transition-colors tracking-wide"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link to="/login" className="hidden sm:block text-[13px] font-medium text-zinc-600 hover:text-zinc-900 transition-colors">
            Masuk
          </Link>
          <Link to="/register">
            <Button className="rounded-full bg-blue-900 hover:bg-blue-950 text-white h-8 text-xs px-4 transition-all duration-300 shadow-sm shadow-blue-900/20">
              Daftar
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
