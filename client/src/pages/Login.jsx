import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const schema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required')
});

export default function Login() {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(schema)
    });
    const { login } = useAuth();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        const success = await login(data);
        if (success) navigate('/dashboard');
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="bg-surface-card p-8 rounded-lg w-full max-w-md">
                <h2 className="text-3xl font-semibold mb-6 text-center text-ink tracking-tight">Welcome Back</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-ink">Work Email</label>
                        <input type="email" placeholder="jane@company.com" {...register('email')} className="w-full px-4 py-3 bg-canvas border border-hairline rounded-md focus:outline-none focus:border-ink transition" />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-ink">Password</label>
                        <input type="password" placeholder="••••••••" {...register('password')} className="w-full px-4 py-3 bg-canvas border border-hairline rounded-md focus:outline-none focus:border-ink transition" />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                    </div>
                    <div className="flex items-center">
                        <input type="checkbox" id="remember" className="mr-2 border-hairline" />
                        <label htmlFor="remember" className="text-sm text-body">Remember me</label>
                    </div>
                    <button disabled={isSubmitting} type="submit" className="w-full py-3 bg-primary text-white hover:bg-primary-active rounded-md font-semibold transition disabled:bg-primary-disabled disabled:text-muted">
                        {isSubmitting ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
                <p className="mt-6 text-center text-sm text-muted">
                    Don't have an account? <Link to="/signup" className="text-ink font-semibold hover:underline">Sign up</Link>
                </p>
            </div>
        </div>
    );
}