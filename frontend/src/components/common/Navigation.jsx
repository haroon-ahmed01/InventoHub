import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../../services/auth.service';
import './Navigation.css';

const Navigation = () => {
    const navigate = useNavigate();
    const currentUser = AuthService.getCurrentUser();
    const isAdmin = currentUser?.user_type === 'admin';

    const handleLogout = () => {
        AuthService.logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="nav-brand">
                <Link to="/">Inventory Management</Link>
            </div>
            <div className="nav-links">
                {currentUser ? (
                    <>
                        <Link to="/products">Products</Link>
                        {isAdmin ? (
                            <>
                                <Link to="/admin/reports">Reports</Link>
                                <Link to="/admin/products/new">Add Product</Link>
                            </>
                        ) : (
                            <Link to="/staff/reports">My Reports</Link>
                        )}
                        <button onClick={handleLogout} className="logout-btn">
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navigation; 