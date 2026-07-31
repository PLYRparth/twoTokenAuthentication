import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            try {
                // If we don't have access token, the interceptor won't trigger immediately on /profile if we don't send one, but the cookie is there.
                // Actually the first request needs an access token to even try, or we rely on interceptor catching the 401.
                // Let's just try to fetch profile. Interceptor will attempt refresh if needed.
                const res = await api.get('/auth/me');
                setUser(res.data);
            } catch (error) {
                console.log('Not logged in');
            } finally {
                setLoading(false);
            }
        };
        loadUser();

        const handleTokenRefresh = (e) => setAccessToken(e.detail);
        const handleLogout = () => { setUser(null); setAccessToken(null); };

        window.addEventListener('tokenRefreshed', handleTokenRefresh);
        window.addEventListener('logoutTriggered', handleLogout);

        return () => {
            window.removeEventListener('tokenRefreshed', handleTokenRefresh);
            window.removeEventListener('logoutTriggered', handleLogout);
        };
    }, []);

    const login = async (data) => {
        try {
            const res = await api.post('/auth/login', data);
            setAccessToken(res.data.data.accessToken);
            api.defaults.headers.common['Authorization'] = `Bearer ${res.data.data.accessToken}`;
            const profileRes = await api.get('/auth/me');
            setUser(profileRes.data);
            toast.success('Logged in successfully');
            return { success: true, user: profileRes.data };
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
            return { success: false };
        }
    };

    const signup = async (data) => {
        try {
            await api.post('/auth/signup', data);
            toast.success('Account created! Please log in.');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Signup failed');
            return false;
        }
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } finally {
            setUser(null);
            setAccessToken(null);
            delete api.defaults.headers.common['Authorization'];
            toast.success('Logged out');
        }
    };

    return (
        <AuthContext.Provider value={{ user, accessToken, loading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);