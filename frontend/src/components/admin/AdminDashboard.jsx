import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardService from '../../services/dashboard.service';
import ProductList from '../products/ProductList';
import ProductForm from '../products/ProductForm';
import StockReportList from '../reports/StockReportList';
import Navigation from '../common/Navigation';
import './Dashboard.css';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const [productStats, reportStats] = await Promise.all([
                DashboardService.getProductStats(),
                DashboardService.getReportStats()
            ]);
            setStats({ ...productStats, ...reportStats });
            setLoading(false);
        } catch (err) {
            setError('Failed to load dashboard statistics');
            setLoading(false);
        }
    };

    const renderStats = () => (
        <div className="dashboard-stats">
            <div className="stat-card">
                <h3>Total Products</h3>
                <div className="value">{stats.total_products}</div>
            </div>
            <div className="stat-card">
                <h3>Low Stock Products</h3>
                <div className="value">{stats.low_stock_products}</div>
            </div>
            <div className="stat-card">
                <h3>Pending Reports</h3>
                <div className="value">{stats.pending_reports}</div>
            </div>
            <div className="stat-card">
                <h3>Total Inventory Value</h3>
                <div className="value">${stats.total_value.toFixed(2)}</div>
            </div>
        </div>
    );

    return (
        <div className="dashboard">
            <Navigation />
            <div className="dashboard-content">
                {error && <div className="error-message">{error}</div>}
                {loading ? (
                    <div className="loading">Loading statistics...</div>
                ) : (
                    stats && renderStats()
                )}
                <Routes>
                    <Route path="/" element={<ProductList />} />
                    <Route path="/products" element={<ProductList />} />
                    <Route path="/products/new" element={<ProductForm />} />
                    <Route path="/products/edit/:id" element={<ProductForm />} />
                    <Route path="/reports" element={<StockReportList />} />
                </Routes>
            </div>
        </div>
    );
};

export default AdminDashboard; 