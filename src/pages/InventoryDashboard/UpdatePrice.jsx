import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UpdatePrice.css';

const UpdatePrice = () => {
  const [products, setProducts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [employeeId, setEmployeeId] = useState('');
  const [price, setPrice] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch products and employees on mount
  useEffect(() => {
    axios
      .get('https://pulse-766719709317.asia-south1.run.app/products')
      .then((res) => setProducts(res.data))
      .catch((err) => console.error('Error fetching products:', err));

    axios
      .get('https://pulse-766719709317.asia-south1.run.app/active')
      .then((res) => setEmployees(res.data))
      .catch((err) => console.error('Error fetching employees:', err));
  }, []);

  const handleProductSelect = (e) => {
    const productId = e.target.value;
    const product = products.find((p) => p.productId.toString() === productId);
    setSelectedProduct(product);
    setPrice(product?.price || '');
    setMessage('');
  };

  const handlePriceChange = (e) => {
    setPrice(e.target.value);
  };

  const handleEmployeeSelect = (e) => {
    setEmployeeId(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedProduct || !price || !employeeId) {
      setMessage('Please select product, new price, and employee.');
      return;
    }

    setLoading(true);

    try {
      await axios.put(
        `https://pulse-766719709317.asia-south1.run.app/products/${selectedProduct.productId}/price`,
        null,
        {
          params: {
            newPrice: price,
            employeeId: employeeId
          }
        }
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
          <label>Select Product</label>
          <select value={selectedProduct?.productId || ''} onChange={handleProductSelect}>
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
              <input
                type="number"
                value={price}
                onChange={handlePriceChange}
                required
                min="0"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label>Select Employee</label>
              <select value={employeeId} onChange={handleEmployeeSelect} required>
                <option value="">-- Select Employee --</option>
                {employees.map((e) => (
                  <option key={e.employeeId} value={e.employeeId}>
                    {e.name} ({e.employeeId})
                  </option>
                ))}
              </select>
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
