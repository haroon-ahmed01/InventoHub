import { useState, useEffect } from 'react';
import StockReportService from '../../services/stockReport.service';
import AuthService from '../../services/auth.service';
import ReportFilter from './ReportFilter';
import './Reports.css';

const StockReportList = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const currentUser = AuthService.getCurrentUser();
    const isAdmin = currentUser?.user_type === 'admin';

    useEffect(() => {
        loadReports();
    }, []);

    const loadReports = async (filters = {}) => {
        try {
            setLoading(true);
            const data = await StockReportService.getAllReports(filters);
            setReports(data);
            setError(null);
        } catch (error) {
            setError('Failed to load reports. Please try again later.');
            console.error('Error loading reports:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilter = (filters) => {
        loadReports(filters);
    };

    const handleResolve = async (id) => {
        try {
            setLoading(true);
            await StockReportService.resolveReport(id);
            setReports(reports.map(report => 
                report.id === id ? { ...report, is_resolved: true } : report
            ));
            setError(null);
        } catch (error) {
            setError('Failed to resolve report. Please try again.');
            console.error('Error resolving report:', error);
        } finally {
            setLoading(false);
        }
    };

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="reports-container">
            <h2>Stock Reports</h2>
            
            {isAdmin && <ReportFilter onFilter={handleFilter} />}

            {loading ? (
                <div className="loading">Loading reports...</div>
            ) : (
                <div className="reports-list">
                    {reports.length === 0 ? (
                        <div className="no-reports">No reports found</div>
                    ) : (
                        reports.map(report => (
                            <div key={report.id} className={`report-card ${report.is_resolved ? 'resolved' : ''}`}>
                                <div className="report-header">
                                    <h3>{report.product_name}</h3>
                                    <span className={`status ${report.is_resolved ? 'resolved' : 'pending'}`}>
                                        {report.is_resolved ? 'Resolved' : 'Pending'}
                                    </span>
                                </div>
                                <p className="report-message">{report.message}</p>
                                <div className="report-details">
                                    <span>Reported by: {report.reported_by_username}</span>
                                    <span>Date: {new Date(report.created_at).toLocaleDateString()}</span>
                                </div>
                                {isAdmin && !report.is_resolved && (
                                    <button 
                                        onClick={() => handleResolve(report.id)}
                                        className="resolve-btn"
                                        disabled={loading}
                                    >
                                        Mark as Resolved
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default StockReportList; 