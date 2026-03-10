import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Wrench, Star } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white pt-28 pb-16 md:pt-36 md:pb-24">
      <div className="container relative mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">

          {/* Text Content - Left Side */}
          <div className="flex flex-col items-start text-left max-w-2xl animate-in fade-in slide-in-from-left-4 duration-1000 z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/50 px-3 py-1.5 text-xs font-semibold text-blue-900 mb-6 backdrop-blur-md">
              <Wrench className="w-3.5 h-3.5" />
              <span>Era Baru Layanan Perbaikan</span>
            </div>

            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-zinc-900 tracking-tight leading-[1.1] mb-6">
              Perangkat Kesayangan Anda. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-blue-600">
                Berfungsi Normal Kembali.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-zinc-500 max-w-xl mb-10 font-medium tracking-tight leading-relaxed">
              Kembalikan performa perangkat elektronik Anda dengan layanan perbaikan premium.
              Cepat, transparan, dan bergaransi resmi.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-10">
              <Link to="/register" className="w-full sm:w-auto">
                <Button size="lg" className="rounded-full bg-blue-900 hover:bg-blue-950 text-white w-full sm:w-auto h-14 px-8 text-base shadow-xl shadow-blue-900/20 transition-all hover:scale-105 active:scale-95 duration-300">
                  Mulai Perbaikan
                </Button>
              </Link>
              <a href="#layanan" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="rounded-full border-zinc-200 text-zinc-900 hover:bg-zinc-50 w-full sm:w-auto h-14 px-8 text-base bg-white transition-all hover:scale-105 active:scale-95 duration-300">
                  Lihat Layanan <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </a>
            </div>

            {/* Trust badge */}
            <div className="flex items-center gap-4 border-t border-zinc-200/50 pt-6">
              <div className="flex -space-x-3">
                {[
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
                  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80",
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
                ].map((img, i) => (
                  <img key={i} src={img} alt="User" className="w-10 h-10 rounded-full border-2 border-white object-cover" />
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-white bg-blue-50 flex items-center justify-center text-xs font-bold text-blue-900">
                  4.8+
                </div>
              </div>
              <div className="text-sm">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-zinc-500 font-medium">Dipercaya 10,000+ pelanggan</span>
              </div>
            </div>
          </div>

          {/* Image Content - Right Side */}
          <div className="relative animate-in fade-in slide-in-from-right-8 duration-1000 delay-200 lg:h-[600px] flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-transparent rounded-[3rem] -rotate-6 scale-95 opacity-50 blur-2xl" />

            <div className="relative aspect-[4/5] lg:aspect-auto w-full max-w-md lg:max-w-none lg:h-full rounded-[2.5rem] overflow-hidden shadow-2xl shadow-blue-900/10 bg-white ring-1 ring-zinc-900/5 z-10">
              <img
                src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1200&q=80"
                alt="Teknisi memperbaiki perangkat elektronik"
                className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-1000 origin-center"
              />

              {/* Overlay Gradient for contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-6 -left-6 lg:-left-12 rounded-2xl border border-white/20 bg-white/90 backdrop-blur-xl px-6 py-4 shadow-2xl z-20 animate-fade-in-up hover:-translate-y-2 transition-transform duration-300">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-900 tracking-tight">Garansi Resmi</p>
                  <p className="text-xs text-zinc-500 font-medium">Hingga 90 Hari</p>
                </div>
              </div>
            </div>

            {/* Second floating badge */}
            <div className="absolute top-12 -right-6 lg:-right-8 rounded-2xl border border-white/20 bg-white/90 backdrop-blur-xl p-4 shadow-2xl z-20 hover:-translate-y-2 transition-transform duration-300">
              <div className="flex flex-col items-center justify-center">
                <p className="text-2xl font-bold text-blue-900 leading-none shadow-sm">1H</p>
                <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider mt-1">Respons Cepat</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
