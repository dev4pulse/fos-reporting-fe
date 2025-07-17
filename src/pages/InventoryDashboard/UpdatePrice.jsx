import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UpdatePrice.css';

const UpdatePrice = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    productName: '',
    currentPrice: '',
    newPrice: '',
    lastPriceUpdated: ''
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
      currentPrice: selectedProduct?.price || '',
      newPrice: '',
      lastPriceUpdated: ''
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
      newPrice: '',
      lastPriceUpdated: ''
    });
  };

  // Submit updated price
  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      productName: formData.productName,
      newPrice: parseFloat(formData.newPrice),
      lastPriceUpdated: new Date(formData.lastPriceUpdated).toISOString()
    };

    axios.post('https://pulse-293050141084.asia-south1.run.app/inventory/update-price', payload)
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
        />

        <label>Last Price Updated</label>
        <input
          type="datetime-local"
          name="lastPriceUpdated"
          value={formData.lastPriceUpdated}
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
