import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StockReportService from '../../services/stockReport.service';
import './Reports.css';

const StockReportForm = ({ product }) => {
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await StockReportService.createReport({
                product: product.id,
                message: message
            });
            navigate('/staff/reports');
        } catch (err) {
            setError('Failed to submit report. Please try again.');
        }
    };

    return (
        <div className="report-form-container">
            <h2>Report Low Stock</h2>
            <h3>Product: {product.name}</h3>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit} className="report-form">
                <div className="form-group">
                    <label>Message:</label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        placeholder="Please describe the stock issue..."
                    />
                </div>
                <button type="submit">Submit Report</button>
            </form>
        </div>
    );
};

export default StockReportForm; 