import { Card } from "@/components/ui/card";
import { Clock, ShieldCheck, BadgeCheck, Headset, Truck, Wallet } from "lucide-react";

const features = [
  {
    icon: Clock,
    title: "Estimasi Real-time",
    description: "Pantau progres perbaikan perangkat Anda langkah demi langkah dengan transparansi penuh.",
  },
  {
    icon: ShieldCheck,
    title: "Garansi Resmi",
    description: "Ketenangan pikiran dengan perlindungan purna jual yang mudah diklaim secara online.",
  },
  {
    icon: BadgeCheck,
    title: "Teknisi Ahli",
    description: "Ditangani langsung oleh para profesional tersertifikasi di bidang elektronika modern.",
  },
  {
    icon: Headset,
    title: "Dukungan Prioritas",
    description: "Tim ahli kami siap menjawab pertanyaan dan kendala Anda dengan respons instan.",
  },
  {
    icon: Truck,
    title: "Jemput & Antar",
    description: "Layanan logistik premium untuk mengambil dan mengantar perangkat Anda dengan aman.",
  },
  {
    icon: Wallet,
    title: "Biaya Transparan",
    description: "Tanpa biaya tersembunyi. Invoice digital terperinci untuk setiap komponen dan layanan.",
  },
];

export function FeaturesSection() {
  return (
    <section id="keunggulan" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 tracking-tight mb-6">
            Didesain untuk Kenyamanan.
          </h2>
          <p className="text-xl text-zinc-500 font-medium tracking-tight">
            Pengalaman perbaikan seharusnya tidak merepotkan. Kami menyederhanakan
            segalanya dari awal hingga akhir.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="border-none shadow-none bg-[#fbfbfd] p-8 rounded-[2rem] hover:bg-zinc-100 transition-colors duration-500 group"
            >
              <div className="mb-6 w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                <feature.icon className="w-6 h-6 text-blue-900 group-hover:scale-110 transition-transform duration-500" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 tracking-tight mb-3">
                {feature.title}
              </h3>
              <p className="text-zinc-500 leading-relaxed font-medium">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
