import { Link } from "react-router-dom"
import { Wrench } from "lucide-react"

interface AuthHeaderProps {
    title: string
    subtitle: string
}

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
    return (
        <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-2">
                <Wrench className="h-8 w-8 text-blue-600" />
                <span className="text-2xl font-bold text-zinc-900">FixIt</span>
            </Link>
            <h1 className="text-2xl font-bold text-zinc-900 mb-2">{title}</h1>
            <p className="text-zinc-600">{subtitle}</p>
        </div>
    )
}
