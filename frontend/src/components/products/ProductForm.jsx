import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProductService from '../../services/product.service';
import './Products.css';

const ProductForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        quantity: '',
        price: ''
    });

    useEffect(() => {
        if (id) {
            loadProduct();
        }
    }, [id]);

    const loadProduct = async () => {
        try {
            setLoading(true);
            const data = await ProductService.getProduct(id);
            setFormData({
                name: data.name,
                description: data.description,
                quantity: data.quantity,
                price: data.price
            });
        } catch (err) {
            setError('Failed to load product details');
            console.error('Error loading product:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            if (id) {
                await ProductService.updateProduct(id, formData);
            } else {
                await ProductService.createProduct(formData);
            }
            navigate('/admin/products');
        } catch (err) {
            setError(id ? 'Failed to update product' : 'Failed to create product');
            console.error('Error saving product:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="product-form-container">
            <h2>{id ? 'Edit Product' : 'Add New Product'}</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit} className="product-form">
                <div className="form-group">
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                </div>
                <div className="form-group">
                    <label>Description:</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                </div>
                <div className="form-group">
                    <label>Quantity:</label>
                    <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        required
                        min="0"
                        disabled={loading}
                    />
                </div>
                <div className="form-group">
                    <label>Price:</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.01"
                        disabled={loading}
                    />
                </div>
                <div className="form-actions">
                    <button 
                        type="button" 
                        onClick={() => navigate('/admin/products')}
                        className="cancel-btn"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit"
                        className="submit-btn"
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : (id ? 'Update Product' : 'Add Product')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductForm; 