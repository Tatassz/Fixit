export function StatsSection() {
    return (
        <section className="py-24 bg-white border-y border-zinc-100">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 max-w-5xl mx-auto divide-x-0 md:divide-x divide-zinc-100">
                    <div className="flex flex-col items-center text-center justify-center space-y-2">
                        <h3 className="text-4xl md:text-5xl font-bold text-blue-900 tracking-tight">10rb+</h3>
                        <p className="text-sm md:text-base font-medium text-zinc-500 tracking-wide">Perbaikan Selesai</p>
                    </div>
                    <div className="flex flex-col items-center text-center justify-center space-y-2">
                        <h3 className="text-4xl md:text-5xl font-bold text-blue-900 tracking-tight">98%</h3>
                        <p className="text-sm md:text-base font-medium text-zinc-500 tracking-wide">Tingkat Kepuasan</p>
                    </div>
                    <div className="flex flex-col items-center text-center justify-center space-y-2 lg:border-l lg:border-zinc-100">
                        <h3 className="text-4xl md:text-5xl font-bold text-blue-900 tracking-tight">50+</h3>
                        <p className="text-sm md:text-base font-medium text-zinc-500 tracking-wide">Teknisi Tersertifikasi</p>
                    </div>
                    <div className="flex flex-col items-center text-center justify-center space-y-2">
                        <h3 className="text-4xl md:text-5xl font-bold text-blue-900 tracking-tight">30<span className="text-2xl md:text-3xl">Hr</span></h3>
                        <p className="text-sm md:text-base font-medium text-zinc-500 tracking-wide">Garansi Standar</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
