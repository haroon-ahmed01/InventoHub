import { Routes, Route } from 'react-router-dom';
import ProductList from '../products/ProductList';
import StockReportList from '../reports/StockReportList';
import StockReportForm from '../reports/StockReportForm';
import Navigation from '../common/Navigation';
import '../admin/Dashboard.css';

const StaffDashboard = () => {
    return (
        <div className="dashboard">
            <Navigation />
            <div className="dashboard-content">
                <Routes>
                    <Route path="/" element={<ProductList />} />
                    <Route path="/products" element={<ProductList />} />
                    <Route path="/reports" element={<StockReportList />} />
                    <Route path="/report/:productId" element={<StockReportForm />} />
                </Routes>
            </div>
        </div>
    );
};

export default StaffDashboard; 