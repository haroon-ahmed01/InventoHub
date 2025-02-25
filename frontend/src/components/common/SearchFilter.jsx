import { useState } from 'react';
import './SearchFilter.css';

const SearchFilter = ({ onFilter, filters }) => {
    const [searchParams, setSearchParams] = useState({
        search: '',
        min_quantity: '',
        max_quantity: '',
        min_price: '',
        max_price: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onFilter(searchParams);
    };

    const handleReset = () => {
        setSearchParams({
            search: '',
            min_quantity: '',
            max_quantity: '',
            min_price: '',
            max_price: ''
        });
        onFilter({});
    };

    return (
        <div className="search-filter">
            <form onSubmit={handleSubmit}>
                <div className="search-bar">
                    <input
                        type="text"
                        name="search"
                        value={searchParams.search}
                        onChange={handleChange}
                        placeholder="Search products..."
                        className="search-input"
                    />
                </div>
                <div className="filters">
                    <div className="filter-group">
                        <label>Quantity Range:</label>
                        <div className="range-inputs">
                            <input
                                type="number"
                                name="min_quantity"
                                value={searchParams.min_quantity}
                                onChange={handleChange}
                                placeholder="Min"
                            />
                            <input
                                type="number"
                                name="max_quantity"
                                value={searchParams.max_quantity}
                                onChange={handleChange}
                                placeholder="Max"
                            />
                        </div>
                    </div>
                    <div className="filter-group">
                        <label>Price Range:</label>
                        <div className="range-inputs">
                            <input
                                type="number"
                                name="min_price"
                                value={searchParams.min_price}
                                onChange={handleChange}
                                placeholder="Min"
                                step="0.01"
                            />
                            <input
                                type="number"
                                name="max_price"
                                value={searchParams.max_price}
                                onChange={handleChange}
                                placeholder="Max"
                                step="0.01"
                            />
                        </div>
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

export default SearchFilter; 