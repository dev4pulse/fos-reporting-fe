import React from 'react';
import './ProductManagement.css';

const ProductManagement = () => {
  return (
    <div className="pm-container">
      <h2 className="pm-heading">Product Management</h2>

      <form className="pm-form">
        <div className="pm-form-group">
          <label className="pm-label">Product Name</label>
          <input type="text" placeholder="e.g. Engine Oil, Coolant" className="pm-input" />
        </div>

        <div className="pm-form-group">
          <label className="pm-label">Price (₹)</label>
          <input type="number" placeholder="Enter price" className="pm-input" />
        </div>

        <div className="pm-form-group">
          <label className="pm-label">Stock Quantity</label>
          <input type="number" placeholder="Enter quantity" className="pm-input" />
        </div>

        <button type="submit" className="pm-submit-btn">Add Product</button>
      </form>
    </div>
  );
};

export default ProductManagement;
