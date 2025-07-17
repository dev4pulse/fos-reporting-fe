import React from 'react';
import './OwnerDashboard.css';

const OwnerDashboard = () => {
  return (
    <div className="owner-dashboard">
      <h2>Owner Dashboard Features: Product Management</h2>

      <div className="button-row">
        <button>List of Products</button>
        <button className="secondary">Delete Product</button>
      </div>

      <div className="product-form">
        <input type="text" placeholder="Product Name" />
        <input type="text" placeholder="Quantity" />
        <input type="datetime-local" placeholder="Date with time" />
        <button>Onboard/Offboard Product</button>
      </div>

      <div className="daily-report-header">
        <input type="date" />
        <button className="secondary">View Daily Sales Report</button>
      </div>

      <div className="pump-section">
        {['Pump 1', 'Pump 2', 'Pump 3', 'Pump 4'].map((pump, index) => (
          <div key={index} className="pump-column">
            <div className="pump-label">{pump}</div>
            <input type="text" placeholder="Open Reading" />
            <input type="text" placeholder="Sale" />
          </div>
        ))}
      </div>

      <div className="form-full">
        <button className="submit-btn">Submit</button>
      </div>
    </div>
  );
};

export default OwnerDashboard;
