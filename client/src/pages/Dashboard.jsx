import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
    const { user, logout, accessToken } = useAuth();
    
    return (
        <div className="min-h-screen p-8 max-w-5xl mx-auto">
            <h1 className="text-5xl font-medium mb-12 text-ink tracking-tight">Your Workspace</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-surface-card border border-hairline p-8 rounded-xl text-ink">
                    <h3 className="text-xl font-semibold mb-4">Enrichment Runs</h3>
                    <p className="opacity-90">1,450 runs this week across all your agents.</p>
                    <div className="mt-8">
                        <button className="px-4 py-2 bg-primary text-white font-semibold rounded-md">View Logs</button>
                    </div>
                </div>

                <div className="bg-surface-card border border-hairline p-8 rounded-xl text-ink">
                    <h3 className="text-xl font-semibold mb-4">Active Agents</h3>
                    <p className="opacity-90">12 active Claygent agents deployed in your sequences.</p>
                    <div className="mt-8">
                        <button className="px-4 py-2 bg-primary text-white font-semibold rounded-md">Manage Agents</button>
                    </div>
                </div>

                <div className="bg-surface-card border border-hairline p-8 rounded-xl text-ink">
                    <h3 className="text-xl font-semibold mb-4">Success Rate</h3>
                    <p className="text-4xl font-medium mt-2">98.5%</p>
                    <div className="mt-6">
                        <button className="px-4 py-2 bg-primary text-white font-semibold rounded-md">View Analytics</button>
                    </div>
                </div>
            </div>

            <div className="mt-12 bg-surface-card p-6 rounded-lg">
                <h2 className="text-lg font-semibold mb-2 text-ink">Developer Details</h2>
                <div className="space-y-2 text-body">
                    <p>Email: {user.email}</p>
                    <p>Account created: {new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
            </div>
        </div>
    );
}