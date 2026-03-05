import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="rounded-[3rem] overflow-hidden bg-blue-900 px-6 py-20 text-center relative selection:bg-white/30 border border-blue-800">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.15)_0%,transparent_60%)]" />

          <div className="relative max-w-3xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-bold text-white tracking-tight leading-tight mb-6">
              Hidupkan Kembali. <br />
              Hari Ini Juga.
            </h2>
            <p className="text-xl text-blue-100/90 mb-12 font-medium tracking-tight max-w-2xl mx-auto">
              Jangan biarkan aktivitas Anda terhambat. Buat jadwal perbaikan
              sekarang dan biarkan teknisi ahli kami mengambil alih.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/register">
                <Button size="lg" className="rounded-full bg-blue-600 hover:bg-blue-500 text-white text-base h-14 px-10 w-full sm:w-auto shadow-xl shadow-blue-900/50 transition-all hover:scale-105 duration-300">
                  Daftar Sekarang
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-blue-400/30 bg-white/5 backdrop-blur-md text-white hover:bg-white/10 text-base h-14 px-10 w-full sm:w-auto transition-all hover:scale-105 duration-300"
              >
                Hubungi Bantuan <ArrowUpRight className="ml-2 w-4 h-4 opacity-70" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
