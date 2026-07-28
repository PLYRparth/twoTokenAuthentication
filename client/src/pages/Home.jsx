import { Link } from 'react-router-dom';
export default function Home() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <h1 className="text-7xl font-medium mb-4 text-ink tracking-tighter text-center">Go to market with<br/>unique data</h1>
            <p className="text-lg text-muted mb-8 max-w-md text-center">A playful B2B SaaS interface running on cream canvas, using robust authentication.</p>
            <div className="flex gap-4">
                <Link to="/login" className="px-5 py-3 rounded-md bg-canvas border border-hairline text-ink font-semibold hover:bg-surface-soft transition">Sign In</Link>
                <Link to="/signup" className="px-5 py-3 rounded-md bg-primary text-white font-semibold hover:bg-primary-active transition">Try Free</Link>
            </div>
        </div>
    );
}