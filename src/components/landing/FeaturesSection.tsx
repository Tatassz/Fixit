import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Shield, CheckCircle } from "lucide-react"

export function FeaturesSection() {
    const features = [
        {
            icon: Clock,
            title: "Layanan Cepat",
            description: "Proses perbaikan yang efisien dengan estimasi waktu yang jelas",
        },
        {
            icon: Shield,
            title: "Garansi Terjamin",
            description: "Setiap perbaikan dilengkapi dengan garansi untuk kepuasan Anda",
        },
        {
            icon: CheckCircle,
            title: "Teknisi Profesional",
            description: "Ditangani oleh teknisi bersertifikat dan berpengalaman",
        },
    ]

    return (
        <section className="bg-zinc-50 py-20">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center text-zinc-900 mb-12">
                    Mengapa Memilih Kami?
                </h2>
                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {features.map((feature) => (
                        <Card key={feature.title} className="border-zinc-200">
                            <CardHeader>
                                <feature.icon className="h-12 w-12 text-blue-900 mb-4" />
                                <CardTitle>{feature.title}</CardTitle>
                                <CardDescription>{feature.description}</CardDescription>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
