import { useNavigate } from 'react-router-dom';
import { useToast } from './useToast';
import { useAuth } from './useAuth';

export const useLogout = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { logout } = useAuth(); // Get logout from context

    const logoutUser = () => {
        try {
            // 1. Call the CONTEXT logout (This sets user to null)
            logout();

            // 2. Show feedback
            showToast('You have been logged out safely.', 'info');

            // 3. Redirect
            navigate('/login', { replace: true });
        } catch (error) {
            console.error("Logout failed", error);
            window.location.href = '/login';
        }
    };

    return { logoutUser };
};