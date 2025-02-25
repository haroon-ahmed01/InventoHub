import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import AdminDashboard from './components/admin/AdminDashboard';
import StaffDashboard from './components/staff/StaffDashboard';
import PrivateRoute from './components/common/PrivateRoute';
import './App.css';

function App() {
    return (
        <Router>
            <div className="app">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/admin/*"
                        element={
                            <PrivateRoute userType="admin">
                                <AdminDashboard />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/staff/*"
                        element={
                            <PrivateRoute userType="staff">
                                <StaffDashboard />
                            </PrivateRoute>
                        }
                    />
                    <Route path="/" element={<Navigate to="/login" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;