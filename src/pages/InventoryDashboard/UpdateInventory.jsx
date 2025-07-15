import React, { useState } from 'react';
import axios from 'axios';
import './Inventory.css';

const UpdateInventory = () => {
  const initialValues = {
    productName: '',
    currentLevel: '',
    date: ''
  };

  const [formData, setFormData] = useState(initialValues);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleClear = () => {
    setFormData(initialValues);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post('https://pulse-293050141084.asia-south1.run.app/inventory/update', formData)
      .then(res => {
        alert('Inventory updated successfully!');
        handleClear();
      })
      .catch(err => {
        alert('Error: ' + err.message);
      });
  };

  return (
    <div className="inventory-container">
      <h2 className="inventory-heading">Update Inventory</h2>
      <form className="inventory-form" onSubmit={handleSubmit}>
        <label>Product Name</label>
        <input
          type="text"
          name="productName"
          value={formData.productName}
          onChange={handleChange}
          required
        />

        <label>Current Inventory (L)</label>
        <input
          type="number"
          name="currentLevel"
          value={formData.currentLevel}
          onChange={handleChange}
          required
        />

        <label>Date & Time</label>
        <input
          type="datetime-local"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />

        <div className="inventory-buttons">
          <button type="submit" className="btn btn-blue">Update</button>
          <button type="button" className="btn btn-gray" onClick={handleClear}>Clear</button>
        </div>
      </form>
    </div>
  );
};

export default UpdateInventory;
