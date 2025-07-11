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
        <button className="secondary">Daily Sale Report</button>
        <input type="date" placeholder="calendar" />
      </div>

      <div className="pump-row">
        <div>Pump 1</div>
        <div>Pump 2</div>
        <div>Pump 3</div>
        <div>Pump 4</div>
      </div>

      <div className="sales-row">
        <div>
          <input type="text" placeholder="Open Reading" />
          <input type="text" placeholder="Sale" />
        </div>
        <div>
          <input type="text" placeholder="Open Reading" />
          <input type="text" placeholder="Sale" />
        </div>
        <div>
          <input type="text" placeholder="Open Reading" />
          <input type="text" placeholder="Sale" />
        </div>
        <div>
          <input type="text" placeholder="Open Reading" />
          <input type="text" placeholder="Sale" />
        </div>
      </div>

      <div className="form-full">
        <button className="submit-btn">Submit</button>
      </div>
    </div>
  );
};

export default OwnerDashboard;
