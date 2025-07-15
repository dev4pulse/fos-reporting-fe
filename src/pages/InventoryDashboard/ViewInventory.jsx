import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Inventory.css';

const ViewInventory = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8080/inventory/latest')
      .then(res => {
        console.log('Inventory data:', res.data); // Check structure if needed
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
                <th>Tank Capacity (L)</th>
                <th>Inventory (L)</th>
                <th>Booking Limit (L)</th>
                <th>Last Inventory Updated</th>
                <th>Last Price Updated</th>
              </tr>
            </thead>
            <tbody>
              {inventoryData.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.productName || '—'}</td>
                  <td>{item.tankCapacity ?? '—'}</td>
                  <td>{item.inventory ?? item.currentLevel ?? '—'}</td>
                  <td>{item.bookingLimit ?? '—'}</td>
                  <td>{item.inventoryUpdated || item.lastUpdated
                    ? new Date(item.inventoryUpdated || item.lastUpdated).toLocaleString()
                    : '—'}</td>
                  <td>{item.priceUpdated
                    ? new Date(item.priceUpdated).toLocaleString()
                    : '—'}</td>
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
