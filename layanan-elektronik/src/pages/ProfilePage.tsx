import { useAuth } from "@/contexts/AuthContext";
import { ProfileForm } from "@/components/profile/ProfileForm";
import type { User } from "@/types";

export default function ProfilePage() {
    const { user, updateUser } = useAuth();

    if (!user) return null;

    const handleUpdate = (updatedUser: User) => {
        updateUser(updatedUser);
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-zinc-900">Profil Saya</h2>
                <p className="text-zinc-600 mt-2">
                    Kelola informasi pribadi dan alamat Anda
                </p>
            </div>

            <ProfileForm initialUser={user} onUpdate={handleUpdate} />
        </div>
    );
}
