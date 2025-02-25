import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthService from '../../services/auth.service';
import './Auth.css';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const data = await AuthService.login(formData);
            if (data.user_type === 'admin') {
                navigate('/admin');
            } else {
                navigate('/staff');
            }
        } catch (err) {
            setError('Invalid username or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Login</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <div className="auth-links">
                    Don't have an account? <Link to="/register">Sign Up</Link>
                </div>
                {/* Add demo credentials */}
                <div className="demo-credentials">
                    <h3>Demo Credentials:</h3>
                    <div className="credential-group">
                        <p><strong>Admin:</strong></p>
                        <p>Username: admin</p>
                        <p>Password: admin123</p>
                    </div>
                    <div className="credential-group">
                        <p><strong>Staff:</strong></p>
                        <p>Username: staff</p>
                        <p>Password: staff123</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login; 