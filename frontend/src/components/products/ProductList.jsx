import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductService from '../../services/product.service';
import AuthService from '../../services/auth.service';
import './Products.css';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        search: '',
        minQuantity: '',
        maxQuantity: '',
        minPrice: '',
        maxPrice: ''
    });
    const currentUser = AuthService.getCurrentUser();
    const isAdmin = currentUser?.user_type === 'admin';
    const navigate = useNavigate();

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async (filterParams = {}) => {
        try {
            setLoading(true);
            const data = await ProductService.getAllProducts(filterParams);
            setProducts(data);
            setError('');
        } catch (err) {
            setError('Failed to load products');
            console.error('Error loading products:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleApplyFilters = (e) => {
        e.preventDefault();
        const activeFilters = {};
        if (filters.search) activeFilters.search = filters.search;
        if (filters.minQuantity) activeFilters.min_quantity = filters.minQuantity;
        if (filters.maxQuantity) activeFilters.max_quantity = filters.maxQuantity;
        if (filters.minPrice) activeFilters.min_price = filters.minPrice;
        if (filters.maxPrice) activeFilters.max_price = filters.maxPrice;
        loadProducts(activeFilters);
    };

    const handleReset = () => {
        setFilters({
            search: '',
            minQuantity: '',
            maxQuantity: '',
            minPrice: '',
            maxPrice: ''
        });
        loadProducts();
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                setLoading(true);
                await ProductService.deleteProduct(id);
                setProducts(products.filter(product => product.id !== id));
                setError(null);
            } catch (error) {
                setError('Failed to delete product. Please try again.');
                console.error('Error deleting product:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleEdit = (id) => {
        navigate(`/admin/products/edit/${id}`);
    };

    const handleReport = (product) => {
        navigate(`/staff/report/${product.id}`, { state: { product } });
    };

    return (
        <div className="products-container">
            <h2>Products</h2>
            
            <div className="filters-section">
                <form onSubmit={handleApplyFilters}>
                    <div className="search-bar">
                        <input
                            type="text"
                            name="search"
                            value={filters.search}
                            onChange={handleFilterChange}
                            placeholder="Search products..."
                            className="search-input"
                        />
                    </div>

                    <div className="filter-group">
                        <h3>Quantity Range:</h3>
                        <div className="range-inputs">
                            <input
                                type="number"
                                name="minQuantity"
                                value={filters.minQuantity}
                                onChange={handleFilterChange}
                                placeholder="Min"
                                min="0"
                            />
                            <input
                                type="number"
                                name="maxQuantity"
                                value={filters.maxQuantity}
                                onChange={handleFilterChange}
                                placeholder="Max"
                                min="0"
                            />
                        </div>
                    </div>

                    <div className="filter-group">
                        <h3>Price Range:</h3>
                        <div className="range-inputs">
                            <input
                                type="number"
                                name="minPrice"
                                value={filters.minPrice}
                                onChange={handleFilterChange}
                                placeholder="Min"
                                min="0"
                            />
                            <input
                                type="number"
                                name="maxPrice"
                                value={filters.maxPrice}
                                onChange={handleFilterChange}
                                placeholder="Max"
                                min="0"
                            />
                        </div>
                    </div>

                    <div className="filter-actions">
                        <button type="submit" className="apply-btn">
                            Apply Filters
                        </button>
                        <button type="button" onClick={handleReset} className="reset-btn">
                            Reset
                        </button>
                    </div>
                </form>
            </div>

            {loading ? (
                <div className="loading">Loading products...</div>
            ) : error ? (
                <div className="error-message">{error}</div>
            ) : (
                <div className="products-grid">
                    {products.length === 0 ? (
                        <div className="no-products">No products found</div>
                    ) : (
                        products.map(product => (
                            <div key={product.id} className="product-card">
                                <h3>{product.name}</h3>
                                <p className="description">{product.description}</p>
                                <div className="product-details">
                                    <span>Quantity: {product.quantity}</span>
                                    <span>Price: ${product.price}</span>
                                </div>
                                <div className="product-actions">
                                    {isAdmin ? (
                                        <>
                                            <button 
                                                onClick={() => handleEdit(product.id)}
                                                className="edit-btn"
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(product.id)}
                                                className="delete-btn"
                                            >
                                                Delete
                                            </button>
                                        </>
                                    ) : (
                                        product.quantity < 10 && (
                                            <button 
                                                onClick={() => handleReport(product)}
                                                className="report-btn"
                                            >
                                                Report Low Stock
                                            </button>
                                        )
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default ProductList; 