import React, { useState, useEffect } from "react";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { api } from "../services/api";

const InventoryManagement = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    quantity: '',  // Changed from 0 to '' for better form handling
    price: '',     // Changed from 0 to '' for better form handling
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      setError('Please login first');
      return;
    }
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await api.getProducts();
      setProducts(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products. Please try again later.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
        const validatedData = {
            name: formData.name.trim(),
            description: formData.description,
            quantity: parseInt(formData.quantity),
            price: parseFloat(formData.price)
        };

        if (isEditing && editId) {
            await api.updateProduct(editId, validatedData);
        } else {
            await api.createProduct(validatedData);
        }
        
        await fetchProducts();
        resetForm();
    } catch (error) {
        console.error('Error saving product:', error);
        setError('Failed to save product. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteProduct(id);
      await fetchProducts();
      setError(null);
    } catch (error) {
      console.error('Error deleting product:', error);
      setError('Failed to delete product. Please try again later.');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      quantity: '',
      price: ''
    });
    setIsEditing(false);
    setEditId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateTotals = () => {
    return products.reduce((acc, product) => ({
      totalQuantity: acc.totalQuantity + product.quantity,
      totalValue: acc.totalValue + (product.quantity * product.price)
    }), { totalQuantity: 0, totalValue: 0 });
  };

  const calculateProductTotal = (product) => {
    return (product.quantity * product.price).toFixed(2);
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="flex gap-6 mb-6">
        {/* Form Section - Left Side */}
        <div className="w-1/3 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
            {isEditing ? '✏️ Edit Product' : '➕ Add New Product'}
          </h2>
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
              <p className="font-medium">Error</p>
              <p>{error}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter product name"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <input
                type="text"
                name="description"
                placeholder="Enter product description"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                placeholder="Enter quantity"
                min="0"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                value={formData.quantity}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit Price ($)
              </label>
              <input
                type="number"
                name="price"
                step="0.01"
                min="0"
                placeholder="Enter price"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                value={formData.price}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                {isEditing ? '💾 Update' : '➕ Add'}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-6 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                >
                  ❌ Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Product List Section - Right Side */}
        <div className="w-2/3 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
            📦 Product List
          </h2>
          <div className="h-[600px] overflow-y-auto pr-2">
            <div className="grid gap-4 grid-cols-2">
              {products.map((product) => (
                <div key={product.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-3 text-sm">{product.description}</p>
                  <div className="space-y-1">
                    <p className="text-gray-700 text-sm">
                      <span className="font-medium">Quantity:</span> {product.quantity}
                    </p>
                    <p className="text-gray-700 text-sm">
                      <span className="font-medium">Unit Price:</span> ${Number(product.price).toFixed(2)}
                    </p>
                    <p className="text-base font-semibold text-green-600">
                      <span className="font-medium">Total:</span> ${calculateProductTotal(product)}
                    </p>
                  </div>
                  <div className="mt-3 pt-3 border-t flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setFormData(product);
                        setIsEditing(true);
                        setEditId(product.id);
                      }}
                      className="text-sm flex items-center gap-1 px-2 py-1 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    >
                      <Pencil size={14} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-sm flex items-center gap-1 px-2 py-1 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Summary Section - Bottom */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
          📊 Inventory Summary
        </h3>
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-600 font-medium">Total Products</p>
            <p className="text-2xl font-bold text-blue-800">{products.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-600 font-medium">Total Quantity</p>
            <p className="text-2xl font-bold text-green-800">{calculateTotals().totalQuantity}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-purple-600 font-medium">Total Value</p>
            <p className="text-2xl font-bold text-purple-800">
              ${calculateTotals().totalValue.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryManagement;