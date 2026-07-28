import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const schema = z.object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
});

export default function Signup() {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(schema)
    });
    const { signup } = useAuth();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        const success = await signup(data);
        if (success) navigate('/login');
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="bg-surface-card p-8 rounded-lg w-full max-w-md">
                <h2 className="text-3xl font-semibold mb-6 text-center text-ink tracking-tight">Create Account</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-ink">Name</label>
                        <input type="text" placeholder="Jane Doe" {...register('name')} className="w-full px-4 py-3 bg-canvas border border-hairline rounded-md focus:outline-none focus:border-ink transition" />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                    </div>
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
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-ink">Confirm Password</label>
                        <input type="password" placeholder="••••••••" {...register('confirmPassword')} className="w-full px-4 py-3 bg-canvas border border-hairline rounded-md focus:outline-none focus:border-ink transition" />
                        {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
                    </div>
                    <button disabled={isSubmitting} type="submit" className="w-full py-3 bg-primary text-white hover:bg-primary-active rounded-md font-semibold transition disabled:bg-primary-disabled disabled:text-muted">
                        {isSubmitting ? 'Creating...' : 'Sign Up'}
                    </button>
                </form>
                <p className="mt-6 text-center text-sm text-muted">
                    Already have an account? <Link to="/login" className="text-ink font-semibold hover:underline">Sign in</Link>
                </p>
            </div>
        </div>
    );
}