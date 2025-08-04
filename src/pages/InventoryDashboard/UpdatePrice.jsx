import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UpdatePrice.css';

const UpdatePrice = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [price, setPrice] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch products on mount
  useEffect(() => {
    axios
      .get('https://pulse-293050141084.asia-south1.run.app/products')
      .then((res) => setProducts(res.data))
      .catch((err) => console.error('Error fetching products:', err));
  }, []);

  // Handle product selection
  const handleProductSelect = (e) => {
    const productId = e.target.value;
    const product = products.find((p) => p.productId.toString() === productId);
    setSelectedProduct(product);
    setPrice(product?.price || '');
    setMessage('');
  };

  // Handle price input
  const handlePriceChange = (e) => {
    setPrice(e.target.value);
  };

  // Submit updated price
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedProduct || !price) {
      setMessage('Please select a product and enter a new price.');
      return;
    }

    setLoading(true);

    try {
      await axios.put(
        `https://pulse-293050141084.asia-south1.run.app/products/${selectedProduct.productId}/price`,
        null,
        { params: { newPrice: price } }
      );

      setMessage(`Price updated successfully for ${selectedProduct.productName}.`);
    } catch (err) {
      console.error(err);
      setMessage('Failed to update price.');
    }

    setLoading(false);
  };

  return (
    <div className="update-price-container">
      <h2>Update Product Price</h2>
      <form onSubmit={handleSubmit} className="update-price-form">
        <div className="form-group">
          <label htmlFor="productSelect">Select Product</label>
          <select id="productSelect" value={selectedProduct?.productId || ''} onChange={handleProductSelect}>
            <option value="">-- Select Product --</option>
            {products.map((product) => (
              <option key={product.productId} value={product.productId}>
                {product.productName}
              </option>
            ))}
          </select>
        </div>

        {selectedProduct && (
          <>
            <div className="form-group">
              <label>Current Price</label>
              <input type="text" value={selectedProduct.price} readOnly />
            </div>

            <div className="form-group">
              <label>New Price</label>
              <input type="number" value={price} onChange={handlePriceChange} required />
            </div>
          </>
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Price'}
        </button>

        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
};

export default UpdatePrice;
