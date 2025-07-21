import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UpdatePrice.css';

const UpdatePrice = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    productName: '',
    currentPrice: '',
    newPrice: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch all products for the dropdown
  useEffect(() => {
    axios.get('https://pulse-293050141084.asia-south1.run.app/inventory/latest')
      .then(res => {
        setProducts(res.data);
      })
      .catch(err => {
        setError('Failed to load products. See console for details.');
        console.error('Failed to fetch products:', err);
      });
  }, []);

  // Update current price when product is selected
  const handleProductSelect = (e) => {
    const productName = e.target.value;
    const selectedProduct = products.find(p => p.productName === productName);
    setFormData({
      productName,
      currentPrice: selectedProduct?.price || '',
      newPrice: '',
    });
    setError('');
    setSuccess('');
  };

  // Handle field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  // Clear the form
  const handleClear = () => {
    setFormData({
      productName: '',
      currentPrice: '',
      newPrice: '',
    });
    setError('');
    setSuccess('');
  };

  // Submit new price to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const { productName, newPrice } = formData;

    // Validation
    if (!productName) {
      setError('Please select a product.');
      setLoading(false);
      return;
    }
    if (!newPrice) {
      setError('Please enter a new price.');
      setLoading(false);
      return;
    }
    const price = parseFloat(newPrice);
    if (isNaN(price) || price <= 0) {
      setError('Please enter a valid positive price.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.put(
        'https://pulse-293050141084.asia-south1.run.app/inventory/update-price',
        { productName, newPrice: price }
      );
      if (response.status === 200) {
        setSuccess('Price updated successfully!'); // <-- Green success message
        handleClear();
      } else {
        setError(response.data || 'Update failed.');
      }
    } catch (err) {
      console.error('Error updating price:', err);
      setError(err.response?.data || 'Failed to update price. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="update-price-container">
      <h2 className="update-price-heading">Update Product Price</h2>
      {success && (
        <div className="update-success-message">
          {success}
        </div>
      )}
      {error && (
        <div className="update-error-message">
          {error}
        </div>
      )}
      <form className="update-price-form" onSubmit={handleSubmit}>
        <label htmlFor="productName">Select Product</label>
        <select
          id="productName"
          name="productName"
          value={formData.productName}
          onChange={handleProductSelect}
          required
          disabled={loading}
        >
          <option value="">-- Select Product --</option>
          {products.map((p) => (
            <option key={p.productID} value={p.productName}>
              {p.productName}
            </option>
          ))}
        </select>

        <label htmlFor="currentPrice">Current Price (₹)</label>
        <input
          id="currentPrice"
          type="text"
          name="currentPrice"
          value={formData.currentPrice}
          readOnly
          disabled={loading}
        />

        <label htmlFor="newPrice">New Price (₹)</label>
        <input
          id="newPrice"
          type="number"
          name="newPrice"
          value={formData.newPrice}
          onChange={handleChange}
          min="0"
          step="0.01"
          placeholder="Enter new price"
          required
          disabled={loading}
        />

        <div className="update-price-buttons">
          <button
            type="submit"
            className="btn btn-blue"
            disabled={!formData.productName || !formData.newPrice || loading}
          >
            {loading ? 'Updating...' : 'Update Price'}
          </button>
          <button
            type="button"
            className="btn btn-gray"
            onClick={handleClear}
            disabled={loading}
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdatePrice;
