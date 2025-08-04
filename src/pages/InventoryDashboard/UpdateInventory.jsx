import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UpdateInventory.css';

const UpdateInventory = () => {
  const [products, setProducts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    productId: '',
    productName: '',
    currentLevel: 0,
    tankCapacity: 0,
    newQty: '',
    refillSpace: 0,
    metric: 'liters',
    employeeId: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch products and employees
  useEffect(() => {
    axios
      .get('https://pulse-293050141084.asia-south1.run.app/inventory/latest')
      .then((res) => setProducts(Array.isArray(res.data) ? res.data : []))
      .catch((err) => {
        console.error('Failed to fetch products:', err);
        setError('Failed to load products.');
      });

    axios
      .get('https://pulse-293050141084.asia-south1.run.app/active')
      .then((res) => setEmployees(Array.isArray(res.data) ? res.data : []))
      .catch((err) => {
        console.error('Failed to fetch employees:', err);
        setError('Failed to load employees.');
      });
  }, []);

  const handleProductSelect = (e) => {
    const productId = e.target.value;
    const product = products.find((p) => String(p.productId) === productId);

    if (!product) {
      resetForm();
      return;
    }

    setFormData((prev) => ({
      ...prev,
      productId: product.productId,
      productName: product.productName || '',
      currentLevel: product.currentLevel ?? 0,
      tankCapacity: product.tankCapacity ?? 0,
      newQty: '',
      refillSpace: (product.tankCapacity ?? 0) - (product.currentLevel ?? 0),
      metric: product.metric || 'liters'
    }));
    setError('');
    setSuccess('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let refillSpace = formData.refillSpace;

    if (name === 'newQty') {
      const newCurrent = (formData.currentLevel ?? 0) + Number(value || 0);
      refillSpace = (formData.tankCapacity ?? 0) - newCurrent;
      if (refillSpace < 0) refillSpace = 0;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      refillSpace: name === 'newQty' ? refillSpace : prev.refillSpace
    }));
    setError('');
  };

  const resetForm = () => {
    setFormData({
      productId: '',
      productName: '',
      currentLevel: 0,
      tankCapacity: 0,
      newQty: '',
      refillSpace: 0,
      metric: 'liters',
      employeeId: ''
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const { productId, newQty, metric, employeeId, currentLevel, tankCapacity } = formData;

    if (!productId || !newQty || isNaN(Number(newQty)) || !employeeId) {
      setError('Please select a product, enter a valid quantity, and choose an employee.');
      setLoading(false);
      return;
    }

    if ((Number(currentLevel) + Number(newQty)) > Number(tankCapacity)) {
      setError(
        `Cannot add ${newQty} ${metric}. Tank capacity exceeded by ${(Number(currentLevel) + Number(newQty) - Number(tankCapacity)).toFixed(2)} ${metric}.`
      );
      setLoading(false);
      return;
    }

    const payload = {
      productId: Number(productId),
      quantity: Number(newQty),
      metric,
      employeeId: Number(employeeId)
    };

    axios
      .post('https://pulse-293050141084.asia-south1.run.app/inventory', payload)
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          setSuccess('Entry added successfully!');
          resetForm();
        } else {
          setError(res.data || 'Failed to add entry.');
        }
      })
      .catch((err) => {
        console.error('Add failed:', err);
        setError(err.response?.data || 'Failed to add entry.');
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="update-inventory-container">
      {success && <div className="update-success-message">{success}</div>}
      {error && <div className="update-error-message">{error}</div>}

      <h2 className="update-inventory-heading">Update Inventory</h2>

      <form className="update-inventory-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group full-width">
            <label>Select Product</label>
            <select
              name="productId"
              value={formData.productId}
              onChange={handleProductSelect}
              required
              disabled={loading}
            >
              <option value="">-- Select Product --</option>
              {products.map((p) => (
                <option key={p.productId} value={p.productId}>
                  {p.productName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group full-width">
            <label>Select Employee</label>
            <select
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              required
              disabled={loading}
            >
              <option value="">-- Select Employee --</option>
              {employees.map((e) => (
                <option key={e.employeeId} value={e.employeeId}>
                  {e.name} ({e.employeeId})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Current Level ({formData.metric})</label>
            <input type="number" value={formData.currentLevel} readOnly />
          </div>
          <div className="form-group">
            <label>Tank Capacity ({formData.metric})</label>
            <input type="number" value={formData.tankCapacity} readOnly />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>New Quantity ({formData.metric})</label>
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
          <div className="form-group">
            <label>Refill Space ({formData.metric})</label>
            <input type="number" value={formData.refillSpace} readOnly />
          </div>
        </div>

        <div className="form-buttons">
          <button type="button" className="btn btn-gray" onClick={resetForm} disabled={loading}>
            Clear
          </button>
          <button
            type="submit"
            className="btn btn-blue"
            disabled={!formData.productId || !formData.newQty || !formData.employeeId || loading}
          >
            {loading ? 'Adding...' : 'Add Entry'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateInventory;
