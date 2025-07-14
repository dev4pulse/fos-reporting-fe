import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './InventoryDashboard.css';

const API_BASE_URL = 'https://pulse-293050141084.asia-south1.run.app';

const InventoryDashboard = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState('table'); // 'table', 'update', 'add'

  const [formData, setFormData] = useState({
    date: '',
    productName: '',
    inventory: '',
    price: ''
  });

  useEffect(() => {
    axios.get(`${API_BASE_URL}/inventory`)
      .then(res => {
        setInventoryData(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const endpoint = view === 'update' ? '/inventory/update' : '/inventory/add';

    axios.post(`${API_BASE_URL}${endpoint}`, formData)
      .then(res => {
        alert(res.data);
        setFormData({ date: '', productName: '', inventory: '', price: '' });
        setView('table');
        window.location.reload();
      })
      .catch(err => alert('Error: ' + err.message));
  };

  const renderForm = () => (
    <div className="inventory-form">
      <h2>{view === 'update' ? 'Update Inventory' : 'Add New Product'}</h2>
      <form onSubmit={handleSubmit}>
        <label>Date and Time:</label>
        <input type="datetime-local" name="date" value={formData.date} onChange={handleChange} required />

        <label>{view === 'update' ? 'Product to Update:' : 'Product Name:'}</label>
        <input
          type="text"
          name="productName"
          value={formData.productName}
          onChange={handleChange}
          required
          placeholder={view === 'update' ? 'Select a product' : 'Enter product name'}
        />

        <label>{view === 'update' ? 'New Inventory Value:' : 'Tank Capacity (Liters):'}</label>
        <input
          type="number"
          name="inventory"
          value={formData.inventory}
          onChange={handleChange}
          required
        />

        <label>{view === 'update' ? "Today's Price ($):" : 'Booking Limit (Liters):'}</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
        />

        <div className="inventory-buttons">
          <button type="button" className="btn btn-gray" onClick={() => setView('table')}>Cancel</button>
          <button type="submit" className="btn btn-blue">{view === 'update' ? 'Save Update' : 'Add Product'}</button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="inventory-container">
      {view === 'table' ? (
        <>
          <h2>Manage Inventory</h2>
          <p className="subtitle">
            Overview of all products, their tank capacities, current inventory, and booking limits.
          </p>

          {loading ? (
            <p>Loading inventory...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : (
            <div className="table-wrapper">
              <table className="inventory-table">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Tank Capacity (Liters)</th>
                    <th>Inventory (Liters)</th>
                    <th>Booking Limit (Liters)</th>
                    <th>Last Inventory Updated</th>
                    <th>Last Price Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryData.map((item, index) => (
                    <tr key={index}>
                      <td>{item.productName}</td>
                      <td>{item.tankCapacity}</td>
                      <td>{item.inventory}</td>
                      <td>{item.bookingLimit}</td>
                      <td>{new Date(item.inventoryUpdated).toLocaleString()}</td>
                      <td>{new Date(item.priceUpdated).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="inventory-buttons">
            <button className="btn btn-blue" onClick={() => setView('add')}>Add New Product</button>
            <button className="btn btn-purple" onClick={() => setView('update')}>Update Inventory</button>
          </div>
        </>
      ) : renderForm()}
    </div>
  );
};

export default InventoryDashboard;