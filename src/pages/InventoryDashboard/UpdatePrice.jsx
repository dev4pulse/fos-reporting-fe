import React, { useState } from 'react';
import axios from 'axios';
import './UpdatePrice.css';

const UpdatePrice = () => {
  const initialValues = {
    productName: '',
    price: '',
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

    axios.post('https://pulse-293050141084.asia-south1.run.app/inventory/update-price', formData)
      .then(() => {
        alert('Price updated successfully!');
        handleClear();
      })
      .catch(err => {
        alert('Error: ' + err.message);
      });
  };

  return (
    <div className="update-price-container">
      <h2 className="update-price-heading">Update Product Price</h2>
      <form className="update-price-form" onSubmit={handleSubmit}>
        <label>Product Name</label>
        <input
          type="text"
          name="productName"
          value={formData.productName}
          onChange={handleChange}
          required
        />

        <label>New Price (₹)</label>
        <input
          type="number"
          name="price"
          value={formData.price}
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

        <div className="update-price-buttons">
          <button type="submit" className="btn btn-blue">Update Price</button>
          <button type="button" className="btn btn-gray" onClick={handleClear}>Clear</button>
        </div>
      </form>
    </div>
  );
};

export default UpdatePrice;
