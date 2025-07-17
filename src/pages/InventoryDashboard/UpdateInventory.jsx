import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UpdateInventory.css';

const UpdateInventory = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    productID: '',
    productName: '',
    currentLevel: '',
    date: '',
  });

  const [tankCapacity, setTankCapacity] = useState('');
  const [refillSpace, setRefillSpace] = useState('');
  const [currentPrice, setCurrentPrice] = useState('');

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

  // When product is selected
  const handleProductChange = (e) => {
    const selected = products.find(p => p.productID.toString() === e.target.value);
    if (selected) {
      setFormData(prev => ({
        ...prev,
        productID: selected.productID.toString(),
        productName: selected.productName,
        currentLevel: selected.currentLevel.toString(),
      }));
      setTankCapacity(selected.tankCapacity);
      setCurrentPrice(selected.price);
      setRefillSpace(selected.tankCapacity - selected.currentLevel);
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
      currentLevel: '',
      date: getLocalDateTime(),
    });
    setTankCapacity('');
    setCurrentPrice('');
    setRefillSpace('');
  };

  // Submit updated inventory
  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post('https://pulse-293050141084.asia-south1.run.app/inventory/update', {
      productName: formData.productName,
      currentLevel: formData.currentLevel,
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
    <div className="update-inventory-container">
      <h2 className="update-inventory-heading">Update Inventory</h2>
      <form className="update-inventory-form" onSubmit={handleSubmit}>
        {/* Date */}
        <label>Date & Time</label>
        <input
          type="datetime-local"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />

        {/* Product Select */}
        <label>Select Product</label>
        <select
          name="productID"
          value={formData.productID}
          onChange={handleProductChange}
          required
        >
          <option value="">-- Select --</option>
          {products.map(prod => (
            <option key={prod.productID} value={prod.productID}>
              {prod.productName}
            </option>
          ))}
        </select>

        {/* New Inventory */}
        <label>New Inventory (L)</label>
        <input
          type="number"
          name="currentLevel"
          value={formData.currentLevel}
          onChange={handleChange}
          required
        />

        {/* Read-only Fields */}
        <label>Current Price</label>
        <input type="text" value={currentPrice} readOnly />

        <label>Tank Capacity (L)</label>
        <input type="text" value={tankCapacity} readOnly />

        <label>Refill Space (L)</label>
        <input type="text" value={refillSpace} readOnly />

        {/* Buttons */}
        <div className="update-inventory-buttons">
          <button type="button" className="btn btn-gray" onClick={handleClear}>Clear</button>
          <button type="submit" className="btn btn-blue">Update</button>
        </div>
      </form>
    </div>
  );
};

export default UpdateInventory;
