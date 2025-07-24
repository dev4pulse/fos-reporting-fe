import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UpdateInventory.css';

const UpdateInventory = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    productID: '',
    productName: '',
    currentQty: '',
    newQty: '',
    tankCapacity: '',
    currentPrice: '',
    refillSpace: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch available products for dropdown
  useEffect(() => {
    axios
      .get('https://pulse-293050141084.asia-south1.run.app/inventory/latest')
      .then((res) => setProducts(res.data))
      .catch((err) => {
        setError('Failed to load products. See console for details.');
        console.error('Failed to fetch products:', err);
      });
  }, []);

  // Handle product selection and fetch details by name if necessary
  const handleProductSelect = async (e) => {
    const productName = e.target.value;
    if (!productName) {
      resetForm();
      return;
    }

    let product = products.find((p) => p.productName === productName);

    if (!product) {
      try {
        const res = await axios.get(
          `https://pulse-293050141084.asia-south1.run.app/inventory/by-name?productName=${encodeURIComponent(productName)}`
        );
        product = res.data;
      } catch (err) {
        setError('Product not found or API error.');
        return;
      }
    }

    setFormData({
      productID: product.productID || '',
      productName: product.productName || '',
      currentQty: product.quantity?.toString() || '',
      tankCapacity: product.tankCapacity?.toString() || '',
      currentPrice: product.price?.toString() || '',
      newQty: '',
      refillSpace: (product.tankCapacity && product.quantity != null)
        ? (Number(product.tankCapacity) - Number(product.quantity)).toString()
        : ''
    });
    setError('');
    setSuccess('');
  };

  // Handle changes in 'New Quantity' and calculate refill space
  const handleChange = (e) => {
    const { name, value } = e.target;
    let refillSpace = formData.refillSpace;

    if (name === 'newQty' && formData.tankCapacity && value !== '') {
      refillSpace = (Number(formData.tankCapacity) - Number(value)).toString();
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      refillSpace: name === 'newQty' ? refillSpace : prev.refillSpace
    }));
    setError('');
  };

  // Reset the form state
  const resetForm = () => {
    setFormData({
      productID: '',
      productName: '',
      currentQty: '',
      newQty: '',
      tankCapacity: '',
      currentPrice: '',
      refillSpace: ''
    });
    setError('');
    setSuccess('');
  };

  // Submit the inventory addition
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const { productID, productName, newQty, tankCapacity, currentPrice } = formData;

    // Validation checks
    if (!productName || !newQty || isNaN(Number(newQty))) {
      setError('Please select a product and enter a valid quantity.');
      setLoading(false);
      return;
    }

    const payload = {
      productID: Number(productID),
      productName,
      quantity: Number(newQty),
      tankCapacity: Number(tankCapacity),
      price: Number(currentPrice),
    };

    axios
      .post('https://pulse-293050141084.asia-south1.run.app/inventory', payload)
      .then((res) => {
        if (res.status === 200 && res.data === "added to inventory") {
          setSuccess('Entry added to inventory!');
          resetForm();
        } else {
          setError(res.data || 'Failed to add entry.');
        }
      })
      .catch((err) => {
        setError(err.response?.data || 'Add failed. See console for details.');
        console.error('Add failed:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="dashboard-content">
      <div className="update-inventory-container">
        {success && (<div className="update-success-message">{success}</div>)}
        {error && (<div className="update-error-message">{error}</div>)}

        <h2 className="update-inventory-heading">Add Inventory Entry</h2>

        <form className="update-inventory-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group full-width">
              <label>Select Product</label>
              <select
                name="productName"
                value={formData.productName}
                onChange={handleProductSelect}
                required
                disabled={loading}
              >
                <option value="">-- Select --</option>
                {products.map((p) => (
                  <option key={p.productID} value={p.productName}>
                    {p.productName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Product ID</label>
              <input
                type="text"
                name="productID"
                value={formData.productID}
                readOnly
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label>Current Quantity (L)</label>
              <input
                type="number"
                name="currentQty"
                value={formData.currentQty}
                readOnly
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>New Quantity (L)*</label>
              <input
                type="number"
                name="newQty"
                value={formData.newQty}
                onChange={handleChange}
                required
                disabled={loading}
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Tank Capacity (L)</label>
              <input
                type="number"
                name="tankCapacity"
                value={formData.tankCapacity}
                readOnly
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label>Current Price (₹)</label>
              <input
                type="number"
                name="currentPrice"
                value={formData.currentPrice}
                readOnly
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Refill Space (L)</label>
              <input
                type="number"
                name="refillSpace"
                value={formData.refillSpace}
                readOnly
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-buttons">
            <button
              type="button"
              className="btn btn-gray"
              onClick={resetForm}
              disabled={loading}
            >
              Clear
            </button>
            <button
              type="submit"
              className="btn btn-blue"
              disabled={!formData.productName || !formData.newQty || loading}
            >
              {loading ? 'Adding...' : 'Add Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateInventory;

