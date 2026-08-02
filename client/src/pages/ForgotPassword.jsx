import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return toast.error('Email is required');
        setLoading(true);
        try {
            const res = await api.post('/auth/forgot-password', { email });
            toast.success(res.data.message || 'OTP sent successfully');
            navigate('/verify-otp', { state: { email } });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 flex items-center justify-center p-4">
            <div className="bg-surface-card p-8 rounded-xl w-full max-w-md border border-hairline shadow-sm">
                <h2 className="text-3xl font-medium text-ink mb-2 text-center tracking-tight">Forgot Password</h2>
                <p className="text-body text-center mb-8">Enter your email to receive an OTP.</p>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-ink mb-2">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-canvas border border-hairline rounded-md focus:outline-none focus:border-ink text-ink placeholder-muted transition-all"
                            placeholder="you@example.com"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary-active text-white font-semibold py-3 px-4 rounded-md transition-colors duration-200 disabled:bg-primary-disabled disabled:text-muted"
                    >
                        {loading ? 'Sending...' : 'Send OTP'}
                    </button>
                </form>
            </div>
        </div>
    );
};
export default ForgotPassword;
