import { useNavigate } from 'react-router-dom';

export default function Unauthorized() {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <h1 className="text-7xl font-bold mb-4 text-ink">403</h1>
            <p className="text-xl text-muted mb-8 text-center">You don't have permission to access this page.</p>
            <button 
                onClick={() => navigate(-1)} 
                className="px-6 py-3 rounded-md bg-primary text-white font-semibold hover:bg-primary-active transition"
            >
                Go Back
            </button>
        </div>
    );
}
