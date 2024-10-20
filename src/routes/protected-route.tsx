import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface IProps {
    children: React.ReactNode
}

const ProtectedRoute = ({ children }: IProps) => {
    const navigate = useNavigate();

    useEffect(() => {
        const sessionId = localStorage.getItem('session_id');
        const guestSession = localStorage.getItem('guest_session_id');

        if (!sessionId && !guestSession) {
            // Jika tidak ada session_id atau guestSession, arahkan ke halaman login
            navigate('/login');
        }
    }, [navigate]);

    // Render halaman anak jika user telah login atau memiliki guest session
    return children;
};

export default ProtectedRoute;
