import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export function CTASection() {
    return (
        <section className="bg-blue-900 py-20">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold text-white mb-4">
                    Siap Memperbaiki Perangkat Anda?
                </h2>
                <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                    Daftar sekarang dan dapatkan konsultasi gratis untuk kebutuhan perbaikan Anda
                </p>
                <Link to="/register">
                    <Button size="lg" variant="secondary" className="bg-white text-blue-900 hover:bg-zinc-100">
                        Daftar Sekarang
                    </Button>
                </Link>
            </div>
        </section>
    )
}
