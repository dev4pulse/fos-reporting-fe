import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UpdatePrice.css';

const UpdatePrice = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    productName: '',
    currentPrice: '',
    newPrice: ''
  });

  // Fetch product list
  useEffect(() => {
    axios.get('https://pulse-293050141084.asia-south1.run.app/inventory/latest')
      .then(res => {
        setProducts(res.data);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
      });
  }, []);

  // On selecting product, update currentPrice
  const handleProductSelect = (e) => {
    const selectedName = e.target.value;
    const selectedProduct = products.find(p => p.productName === selectedName);

    setFormData(prev => ({
      ...prev,
      productName: selectedName,
      currentPrice: selectedProduct?.price ?? '',
      newPrice: ''
    }));
  };

  // Handle field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Clear form
  const handleClear = () => {
    setFormData({
      productName: '',
      currentPrice: '',
      newPrice: ''
    });
  };

  // Submit updated price
  const handleSubmit = (e) => {
    e.preventDefault();

    const { productName, newPrice } = formData;

    // Validate inputs
    if (!productName || !newPrice) {
      alert('Please select a product and enter a new price.');
      return;
    }

    const priceValue = parseFloat(newPrice);
    if (isNaN(priceValue) || priceValue <= 0) {
      alert('Please enter a valid new price.');
      return;
    }

    const payload = {
      productName,
      newPrice: priceValue,
      lastPriceUpdated: new Date().toISOString()
    };

    axios.post(
        'https://pulse-293050141084.asia-south1.run.app/inventory/update-price',
        payload
      )
      .then(() => {
        alert('Price updated successfully!');
        handleClear();
      })
      .catch(err => {
        console.error('Error updating price:', err);
        alert('Failed to update price');
      });
  };

  return (
    <div className="update-price-container">
      <h2 className="update-price-heading">Update Product Price</h2>
      <form className="update-price-form" onSubmit={handleSubmit}>

        <label>Select Product</label>
        <select
          name="productName"
          value={formData.productName}
          onChange={handleProductSelect}
          required
        >
          <option value="">-- Select Product --</option>
          {products.map((prod, idx) => (
            <option key={idx} value={prod.productName}>{prod.productName}</option>
          ))}
        </select>

        <label>Current Price (₹)</label>
        <input
          type="text"
          name="currentPrice"
          value={formData.currentPrice}
          readOnly
        />

        <label>New Price (₹)</label>
        <input
          type="number"
          name="newPrice"
          value={formData.newPrice}
          onChange={handleChange}
          required
          min="0"
          step="0.01"
          placeholder="Enter new price"
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
