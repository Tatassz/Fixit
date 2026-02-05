import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Wrench } from "lucide-react"

export function Navbar() {
    return (
        <nav className="border-b border-zinc-200 bg-white sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2">
                    <Wrench className="h-6 w-6 text-blue-900" />
                    <span className="text-xl font-bold text-zinc-900">FixIt</span>
                </Link>
                <div className="flex items-center gap-3">
                    <Link to="/login">
                        <Button variant="ghost" className="text-zinc-700">
                            Masuk
                        </Button>
                    </Link>
                    <Link to="/register">
                        <Button className="bg-blue-900 hover:bg-blue-950">
                            Daftar Sekarang
                        </Button>
                    </Link>
                </div>
            </div>
        </nav>
    )
}
