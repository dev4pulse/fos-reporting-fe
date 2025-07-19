import React, { useState } from 'react';
import axios from 'axios';
import './AddProduct.css';

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
    setFormData(initialValues);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post('https://pulse-293050141084.asia-south1.run.app/inventory/', formData)
      .then(() => {
        alert('Product added successfully!');
        handleClear();
      })
      .catch(err => {
        alert('Error: ' + err.message);
      });
  };

  return (
    <div className="add-product-container">
      <h2 className="add-product-heading">Add New Product</h2>
      <form className="add-product-form" onSubmit={handleSubmit}>
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
          name="Inventory"
          value={formData.bookingLimit}
          onChange={handleChange}

        />

        <div className="add-product-buttons">
          <button type="submit" className="btn btn-blue">Add Product</button>
          <button type="button" className="btn btn-gray" onClick={handleClear}>Clear</button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
