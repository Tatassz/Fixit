import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export function HeroSection() {
    return (
        <section className="container mx-auto px-4 py-20">
            <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-5xl font-bold text-zinc-900 mb-6">
                    Layanan Perbaikan Elektronik Terpercaya
                </h1>
                <p className="text-xl text-zinc-600 mb-8">
                    Solusi cepat dan profesional untuk semua kebutuhan perbaikan perangkat elektronik Anda.
                    Teknisi berpengalaman, harga transparan, dan garansi terjamin.
                </p>
                <div className="flex gap-4 justify-center">
                    <Link to="/register">
                        <Button size="lg" className="bg-blue-900 hover:bg-blue-950">
                            Mulai Perbaikan
                        </Button>
                    </Link>
                    <Button size="lg" variant="outline" className="border-zinc-300">
                        Lihat Layanan
                    </Button>
                </div>
            </div>
        </section>
    )
}
