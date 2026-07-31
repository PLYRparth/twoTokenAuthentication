import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();

    if (!user) return null;

    return (
        <nav className="flex justify-between items-center p-4 border-b border-hairline bg-surface-card">
            <div className="flex items-center gap-6">
                <span className="font-bold text-ink">MyApp</span>
                {user.role === 'ADMIN' ? (
                    <>
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded">Admin</span>
                        <Link to="/admin" className="text-sm font-medium text-ink hover:text-primary">Dashboard</Link>
                        <Link to="/admin/users" className="text-sm font-medium text-ink hover:text-primary">Manage Users</Link>
                        <Link to="/admin/analytics" className="text-sm font-medium text-ink hover:text-primary">Analytics</Link>
                    </>
                ) : (
                    <>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">Employee</span>
                        <Link to="/dashboard" className="text-sm font-medium text-ink hover:text-primary">Dashboard</Link>
                        <Link to="/profile" className="text-sm font-medium text-ink hover:text-primary">Profile</Link>
                    </>
                )}
            </div>
            <div className="flex items-center gap-4">
                <span className="text-sm text-muted">{user.name}</span>
                <button onClick={logout} className="text-sm px-3 py-1 bg-canvas border border-hairline rounded hover:bg-surface-soft transition">Logout</button>
            </div>
        </nav>
    );
}
