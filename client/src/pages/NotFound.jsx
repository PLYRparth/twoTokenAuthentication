import { Link } from 'react-router-dom';
export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <h1 className="text-6xl font-bold mb-4">404</h1>
            <p className="text-xl text-slate-400 mb-8">Page not found</p>
            <Link to="/" className="text-blue-400 hover:underline">Go Home</Link>
        </div>
    );
}