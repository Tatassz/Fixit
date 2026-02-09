import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react"

interface PasswordInputProps {
    id: string
    placeholder?: string
    value: string
    onChange: (value: string) => void
    required?: boolean
    minLength?: number
    className?: string
}

export function PasswordInput({
    id,
    placeholder = "••••••••",
    value,
    onChange,
    required = false,
    minLength,
    className = "border-zinc-300",
}: PasswordInputProps) {
    const [showPassword, setShowPassword] = useState(false)

    return (
        <div className="relative">
            <Input
                id={id}
                type={showPassword ? "text" : "password"}
                placeholder={placeholder}
                className={className}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                required={required}
                minLength={minLength}
            />
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700"
            >
                {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                ) : (
                    <Eye className="h-4 w-4" />
                )}
            </button>
        </div>
    )
}
