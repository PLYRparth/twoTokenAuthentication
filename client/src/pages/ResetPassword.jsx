import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    
    const resetToken = location.state?.resetToken;

    if (!resetToken) {
        toast.error('Session expired. Please request a new OTP.');
        navigate('/forgot-password');
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password.length < 8) return toast.error('Password must be at least 8 characters');
        if (password !== confirmPassword) return toast.error('Passwords do not match');
        
        setLoading(true);
        try {
            const res = await api.post('/auth/reset-password', { password }, {
                headers: { Authorization: `Bearer ${resetToken}` }
            });
            toast.success(res.data.message || 'Password reset successfully');
            navigate('/login', { replace: true, state: {} });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to reset password');
            if (error.response?.status === 400 || error.response?.status === 401) {
                navigate('/forgot-password');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 flex items-center justify-center p-4">
            <div className="bg-surface-card p-8 rounded-xl w-full max-w-md border border-hairline shadow-sm">
                <h2 className="text-3xl font-medium text-ink mb-2 text-center tracking-tight">Reset Password</h2>
                <p className="text-body text-center mb-8">Enter your new secure password.</p>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-ink mb-2">New Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-canvas border border-hairline rounded-md focus:outline-none focus:border-ink text-ink placeholder-muted transition-all"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-ink mb-2">Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-canvas border border-hairline rounded-md focus:outline-none focus:border-ink text-ink placeholder-muted transition-all"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary-active text-white font-semibold py-3 px-4 rounded-md transition-colors duration-200 disabled:bg-primary-disabled disabled:text-muted"
                    >
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};
export default ResetPassword;
