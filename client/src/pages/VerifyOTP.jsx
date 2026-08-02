import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

const VerifyOTP = () => {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    if (!email) {
        navigate('/forgot-password');
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!otp || otp.length !== 6) return toast.error('OTP must be exactly 6 digits');
        setLoading(true);
        try {
            const res = await api.post('/auth/verify-reset-otp', { email, otp });
            toast.success('OTP verified successfully');
            navigate('/reset-password', { state: { resetToken: res.data.resetToken } });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 flex items-center justify-center p-4">
            <div className="bg-surface-card p-8 rounded-xl w-full max-w-md border border-hairline shadow-sm">
                <h2 className="text-3xl font-medium text-ink mb-2 text-center tracking-tight">Verify OTP</h2>
                <p className="text-body text-center mb-8">Enter the 6-digit OTP sent to <br/><span className="text-ink font-semibold">{email}</span></p>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-ink mb-2">One-Time Password</label>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            className="w-full px-4 py-3 bg-canvas border border-hairline rounded-md focus:outline-none focus:border-ink text-ink placeholder-muted text-center text-3xl tracking-[0.3em] font-mono transition-all"
                            placeholder="••••••"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary-active text-white font-semibold py-3 px-4 rounded-md transition-colors duration-200 disabled:bg-primary-disabled disabled:text-muted"
                    >
                        {loading ? 'Verifying...' : 'Verify OTP'}
                    </button>
                </form>
            </div>
        </div>
    );
};
export default VerifyOTP;
