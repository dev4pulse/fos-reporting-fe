import React, { useState } from 'react';
import axios from 'axios';
import './Inventory.css';

const AddProduct = () => {
  const initialValues = {
    productName: '',
    tankCapacity: '',
    bookingLimit: ''
  };

  const [formData, setFormData] = useState(initialValues);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleClear = () => {
    setFormData(initialValues); // ✅ this works because initialValues is stable
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post('http://localhost:8080/inventory/add', formData)
      .then(res => {
        alert('Product added successfully!');
        handleClear(); // Clear form after successful submission
      })
      .catch(err => {
        alert('Error: ' + err.message);
      });
  };

  return (
    <div className="inventory-container">
      <h2 className="inventory-heading">Add New Product</h2>
      <form className="inventory-form" onSubmit={handleSubmit}>
        <label>Product Name</label>
        <input
          type="text"
          name="productName"
          value={formData.productName}
          onChange={handleChange}
          required
        />

        <label>Tank Capacity (L)</label>
        <input
          type="number"
          name="tankCapacity"
          value={formData.tankCapacity}
          onChange={handleChange}
          required
        />

        <label>Booking Limit (L)</label>
        <input
          type="number"
          name="bookingLimit"
          value={formData.bookingLimit}
          onChange={handleChange}
          required
        />

        <div className="inventory-buttons">
          <button type="submit" className="btn btn-blue">Add Product</button>
          <button type="button" className="btn btn-gray" onClick={handleClear}>Clear</button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
