import React from 'react';

const ProductManagement = () => {
  return (
    <div>
      <h2>Product Management</h2>
      <form>
        <label>Product Name</label>
        <input type="text" placeholder="e.g. Engine Oil, Coolant" />

        <label>Price (₹)</label>
        <input type="number" placeholder="Enter price" />

        <label>Stock Quantity</label>
        <input type="number" placeholder="Enter quantity" />

        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default ProductManagement;
