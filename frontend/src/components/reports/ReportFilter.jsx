import { useState } from 'react';
import './Reports.css';

const ReportFilter = ({ onFilter }) => {
    const [filters, setFilters] = useState({
        is_resolved: '',
        date_from: '',
        date_to: '',
        reporter: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const activeFilters = Object.fromEntries(
            Object.entries(filters).filter(([_, value]) => value !== '')
        );
        onFilter(activeFilters);
    };

    const handleReset = () => {
        setFilters({
            is_resolved: '',
            date_from: '',
            date_to: '',
            reporter: ''
        });
        onFilter({});
    };

    return (
        <div className="report-filter">
            <form onSubmit={handleSubmit}>
                <div className="filter-row">
                    <div className="filter-group">
                        <label>Status:</label>
                        <select
                            name="is_resolved"
                            value={filters.is_resolved}
                            onChange={handleChange}
                        >
                            <option value="">All</option>
                            <option value="false">Pending</option>
                            <option value="true">Resolved</option>
                        </select>
                    </div>
                    <div className="filter-group">
                        <label>Reporter:</label>
                        <input
                            type="text"
                            name="reporter"
                            value={filters.reporter}
                            onChange={handleChange}
                            placeholder="Search by reporter name"
                        />
                    </div>
                </div>
                <div className="filter-row">
                    <div className="filter-group">
                        <label>Date From:</label>
                        <input
                            type="date"
                            name="date_from"
                            value={filters.date_from}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="filter-group">
                        <label>Date To:</label>
                        <input
                            type="date"
                            name="date_to"
                            value={filters.date_to}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="filter-actions">
                    <button type="submit" className="apply-btn">Apply Filters</button>
                    <button type="button" onClick={handleReset} className="reset-btn">Reset</button>
                </div>
            </form>
        </div>
    );
};

export default ReportFilter; 