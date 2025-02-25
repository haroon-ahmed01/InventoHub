import { Navigate } from 'react-router-dom';
import AuthService from '../../services/auth.service';

const PrivateRoute = ({ children, userType }) => {
    const currentUser = AuthService.getCurrentUser();

    if (!currentUser) {
        return <Navigate to="/login" />;
    }

    if (userType && currentUser.user_type !== userType) {
        return <Navigate to="/" />;
    }

    return children;
};

export default PrivateRoute; 