import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
    const { user, logout } = useAuth();
    
    return (
        <div className="min-h-screen p-8 max-w-5xl mx-auto">
            <h1 className="text-5xl font-medium mb-12 text-ink tracking-tight">Admin Area</h1>

            <div className="bg-surface-card border border-hairline p-8 rounded-xl text-ink">
                <h3 className="text-xl font-semibold mb-4">Manage Users</h3>
                <p className="opacity-90">Only administrators can see this content.</p>
            </div>
        </div>
    );
}
