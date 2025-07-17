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
    refillCapacity: '',
    date: ''
  });

  // Get local datetime string for datetime-local input
  const getLocalDateTime = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const localDate = new Date(now.getTime() - offset * 60000);
    return localDate.toISOString().slice(0, 16); // YYYY-MM-DDTHH:MM
  };

  // Fetch products and set default date
  useEffect(() => {
    axios
      .get('https://pulse-293050141084.asia-south1.run.app/inventory/latest')
      .then((res) => setProducts(res.data))
      .catch((err) => console.error('Failed to fetch products:', err));

    setFormData((prev) => ({
      ...prev,
      date: getLocalDateTime(),
    }));
  }, []);

  // Handle product selection
  const handleProductSelect = (e) => {
    const selectedID = e.target.value;
    const selectedProduct = products.find(p => p.productID.toString() === selectedID);

    if (selectedProduct) {
      const currentQty = selectedProduct.quantity;
      const tankCapacity = selectedProduct.tankCapacity;
      const refillCapacity = tankCapacity - currentQty;

      setFormData({
        ...formData,
        productID: selectedProduct.productID.toString(),
        productName: selectedProduct.productName,
        currentQty: currentQty.toString(),
        newQty: '',
        tankCapacity: tankCapacity.toString(),
        refillCapacity: refillCapacity.toString()
      });
    }
  };

  // Handle input change
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Clear form
  const handleClear = () => {
    setFormData({
      productID: '',
      productName: '',
      currentQty: '',
      newQty: '',
      tankCapacity: '',
      refillCapacity: '',
      date: getLocalDateTime(),
    });
  };

  // Submit updated inventory
  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post('https://pulse-293050141084.asia-south1.run.app/inventory/update', {
      productName: formData.productName,
      currentLevel: formData.newQty,
      date: formData.date,
    })
      .then(() => {
        alert('Inventory updated successfully!');
        handleClear();
      })
      .catch(err => {
        alert('Update failed: ' + err.message);
      });
  };

  return (
    <div className="dashboard-content">
      <div className="update-inventory-container">
        <h2 className="update-inventory-heading">Update Inventory</h2>
        <form className="update-inventory-form" onSubmit={handleSubmit}>

          {/* Date */}
          <div className="form-row">
            <div className="form-group full-width">
              <label>Date & Time</label>
              <input
                type="datetime-local"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Product Select */}
          <div className="form-row">
            <div className="form-group full-width">
              <label>Select Product</label>
              <select
                name="productID"
                value={formData.productID}
                onChange={handleProductSelect}
                required
              >
                <option value="">-- Select --</option>
                {products.map(prod => (
                  <option key={prod.productID} value={prod.productID}>
                    {prod.productName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Product Info */}
          <div className="form-row">
            <div className="form-group">
              <label>Current Quantity (L)</label>
              <input type="number" name="currentQty" value={formData.currentQty} readOnly />
            </div>

            <div className="form-group">
              <label>New Quantity (L)</label>
              <input
                type="number"
                name="newQty"
                value={formData.newQty}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Total Tank Capacity (L)</label>
              <input type="number" name="tankCapacity" value={formData.tankCapacity} readOnly />
            </div>

            <div className="form-group">
              <label>Refill Capacity (L)</label>
              <input type="number" name="refillCapacity" value={formData.refillCapacity} readOnly />
            </div>
          </div>

          {/* Buttons */}
          <div className="form-buttons">
            <button type="button" className="btn btn-gray" onClick={handleClear}>Clear</button>
            <button type="submit" className="btn btn-blue">Update</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateInventory;
