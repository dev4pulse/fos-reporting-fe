import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UpdatePrice.css';

const UpdatePrice = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    productName: '',
    currentPrice: '',
    price: '',
    date: ''
  });

  // Fetch all products once
  useEffect(() => {
    axios.get('https://pulse-293050141084.asia-south1.run.app/inventory/latest')
      .then(res => {
        setProducts(res.data);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
      });
  }, []);

  // On product select, update current price from already fetched list
  const handleProductSelect = (e) => {
    const selectedProduct = e.target.value;

    const matchedProduct = products.find(prod => prod.productName === selectedProduct);
    const currentPrice = matchedProduct ? matchedProduct.price : 'Not Found';

    setFormData(prev => ({
      ...prev,
      productName: selectedProduct,
      currentPrice: currentPrice,
      price: ''
    }));
  };

  // Handle field changes
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Clear form
  const handleClear = () => {
    setFormData({
      productName: '',
      currentPrice: '',
      price: '',
      date: ''
    });
  };

  // Submit updated price
  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      productName: formData.productName,
      price: parseFloat(formData.price),
      date: formData.date
    };

    axios.post('https://pulse-293050141084.asia-south1.run.app/inventory/update-price', payload)
      .then(() => {
        alert('Price updated successfully!');
        handleClear();
      })
      .catch(err => {
        alert('Error updating price: ' + err.message);
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
