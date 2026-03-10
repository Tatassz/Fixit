import { Wrench } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white border-t border-zinc-200/50 pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="grid gap-12 md:grid-cols-4 mb-16">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Wrench className="w-5 h-5 text-zinc-900" />
              <span className="text-xl font-semibold text-zinc-900 tracking-tight">FixIt</span>
            </div>
            <p className="text-sm text-zinc-500 font-medium">
              Standar baru layanan purna jual untuk perangkat elektronik modern Anda.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-zinc-900 tracking-tight mb-4">Layanan</h4>
            <ul className="space-y-3 text-sm text-zinc-500 font-medium">
              <li><a href="#" className="hover:text-zinc-900 transition-colors">Perbaikan Televisi</a></li>
              <li><a href="#" className="hover:text-zinc-900 transition-colors">Sistem Pendingin</a></li>
              <li><a href="#" className="hover:text-zinc-900 transition-colors">Perangkat Pintar</a></li>
              <li><a href="#" className="hover:text-zinc-900 transition-colors">Informasi Garansi</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-zinc-900 tracking-tight mb-4">Dukungan</h4>
            <ul className="space-y-3 text-sm text-zinc-500 font-medium">
              <li><a href="#" className="hover:text-zinc-900 transition-colors">Pusat Bantuan</a></li>
              <li><a href="#" className="hover:text-zinc-900 transition-colors">Hubungi Kami</a></li>
              <li><a href="#" className="hover:text-zinc-900 transition-colors">Lacak Pesanan</a></li>
              <li><a href="#" className="hover:text-zinc-900 transition-colors">Syarat & Ketentuan</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-zinc-900 tracking-tight mb-4">Kontak</h4>
            <ul className="space-y-3 text-sm text-zinc-500 font-medium">
              <li>support@fixit.id</li>
              <li>0812-3456-7890</li>
              <li className="pt-2 text-xs">Senin–Jumat (08:00 - 20:00)</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-zinc-100 text-xs text-zinc-400 font-medium">
          <p>© 2026 FixIt Inc. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-zinc-900 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-zinc-900 transition-colors">Terms of Use</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
