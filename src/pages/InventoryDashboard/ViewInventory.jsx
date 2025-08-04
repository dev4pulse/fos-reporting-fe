import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Inventory.css';

const ViewInventory = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('https://pulse-293050141084.asia-south1.run.app/inventory/latest')
      .then(res => {
        console.log('Inventory data:', res.data);
        setInventoryData(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load inventory: ' + err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="inventory-container">
      <h2 className="inventory-heading">View Inventory</h2>

      {loading ? (
        <p className="loading-text">Loading inventory data...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : (
        <div className="table-wrapper">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Product Name</th>
                <th>Status</th>
                <th>Tank Capacity ({inventoryData[0]?.metric || 'L'})</th>
                <th>Current Inventory ({inventoryData[0]?.metric || 'L'})</th>
                <th>Current Price (₹)</th>
                <th>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {inventoryData.map((item, index) => (
                <tr key={item.productId}>
                  <td>{index + 1}</td>
                  <td>{item.productName || '—'}</td>
                  <td>{item.status || '—'}</td>
                  <td>{item.tankCapacity ?? '—'}</td>
                  <td>{item.currentLevel ?? '—'}</td>
                  <td>{item.currentPrice ?? '—'}</td>
                  <td>{item.lastUpdated
                    ? new Date(item.lastUpdated).toLocaleString()
                    : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewInventory;
