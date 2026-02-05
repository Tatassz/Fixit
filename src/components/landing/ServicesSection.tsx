import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Smartphone, Laptop, Tv, CheckCircle } from "lucide-react"

export function ServicesSection() {
    const services = [
        {
            icon: Smartphone,
            title: "Smartphone",
            items: [
                "Ganti LCD/Touchscreen",
                "Perbaikan Baterai",
                "Service Software",
            ],
        },
        {
            icon: Laptop,
            title: "Laptop/PC",
            items: [
                "Upgrade Hardware",
                "Install Ulang OS",
                "Cleaning & Maintenance",
            ],
        },
        {
            icon: Tv,
            title: "Elektronik Lainnya",
            items: [
                "TV & Monitor",
                "Printer & Scanner",
                "Konsultasi Gratis",
            ],
        },
    ]

    return (
        <section className="py-20">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center text-zinc-900 mb-12">
                    Layanan Kami
                </h2>
                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {services.map((service) => (
                        <Card
                            key={service.title}
                            className="border-zinc-200 hover:border-blue-900 transition-colors"
                        >
                            <CardHeader>
                                <service.icon className="h-12 w-12 text-blue-900 mb-4" />
                                <CardTitle>{service.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-zinc-600">
                                    {service.items.map((item) => (
                                        <li key={item} className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-blue-900 flex-shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
