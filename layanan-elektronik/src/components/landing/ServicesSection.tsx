import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  {
    title: "Televisi & Display",
    description: "Perbaikan panel layar, mainboard, dan kalibrasi warna untuk pengalaman visual sempurna.",
    image:
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=1000&q=80",
  },
  {
    title: "Sistem Pendingin",
    description: "Perawatan kompresor, pembersihan mendalam, dan pengisian freon untuk sirkulasi udara optimal.",
    image:
      "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1000&q=80",
  },
  {
    title: "Perangkat Pintar",
    description: "Diagnostik kelistrikan dan perbaikan modul kontrol untuk elektronik cerdas di rumah Anda.",
    image:
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1000&q=80",
  },
];

export function ServicesSection() {
  return (
    <section id="layanan" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 tracking-tight mb-4">
              Pakar Segalanya.
            </h2>
            <p className="text-xl text-zinc-500 font-medium tracking-tight">
              Dari perangkat hiburan hingga utilitas rumah tangga, teknisi kami
              mampu menangani dengan presisi.
            </p>
          </div>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 text-blue-900 hover:text-blue-800 font-medium tracking-wide group"
          >
            Lihat semua layanan
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.title}
              className="group relative overflow-hidden rounded-[2rem] bg-zinc-100 aspect-[4/5] cursor-pointer border border-zinc-200/50"
            >
              <img
                src={service.image}
                alt={service.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col justify-end bg-gradient-to-t from-zinc-900/90 via-zinc-900/40 to-transparent h-2/3">
                <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">{service.title}</h3>
                <p className="text-zinc-200 text-sm leading-relaxed mb-6 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                  {service.description}
                </p>
                <div className="w-10 h-10 rounded-full bg-blue-600 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-lg shadow-blue-900/50">
                  <ArrowRight className="w-5 h-5 -rotate-45" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
