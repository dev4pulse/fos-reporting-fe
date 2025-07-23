import React, { useState } from 'react';
import axios from 'axios';
import './AddProduct.css';

const AddProduct = () => {
  const initialValues = {
    productName: '',
    description: '',
    tankCapacity: '',
    price: '',
    status: 'ACTIVE', // default
  };

  const [formData, setFormData] = useState(initialValues);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClear = () => {
    setFormData(initialValues);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/products', formData);
      alert('Product added successfully!');
      handleClear();
    } catch (err) {
      console.error('Error adding product:', err);
      alert('Failed to add product: ' + err.message);
    }
  };

  return (
    <div className="add-product-container">
      <h2 className="add-product-heading">Add New Product</h2>
      <form className="add-product-form" onSubmit={handleSubmit}>
        <div className="input-row">
          <div style={{ flex: 1 }}>
            <label>Product Name</label>
            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ flex: 1 }}>
            <label>Description</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="input-row">
          <div style={{ flex: 1 }}>
            <label>Tank Capacity (L)</label>
            <input
              type="number"
              name="tankCapacity"
              value={formData.tankCapacity}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ flex: 1 }}>
            <label>Price (₹)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <label>Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
        >
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
        </select>

        <div className="add-product-buttons">
          <button type="submit" className="btn btn-blue">Add Product</button>
          <button type="button" className="btn btn-gray" onClick={handleClear}>Clear</button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
