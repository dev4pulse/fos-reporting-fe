import React from 'react';
import './BorrowersDashboard.css';

const BorrowersDashboard = () => {
  return (
    <div className="borrowers-dashboard">
      <h2>Borrowers Dashboard</h2>
      <form className="borrowers-form">
        <div className="form-row">
          <div className="form-group">
            <label>Borrower Name</label>
            <input type="text" placeholder="Enter name" />
          </div>
          <div className="form-group">
            <label>Fuel/Amount Borrowed</label>
            <input type="text" placeholder="e.g. 100L Diesel or ₹5000" />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Due Date</label>
            <input type="date" />
          </div>
          <div className="form-group">
            <label>Contact Number</label>
            <input type="tel" />
          </div>
        </div>

        <div className="form-submit">
          <button type="submit">Add Borrower Record</button>
        </div>
      </form>
    </div>
  );
};

export default BorrowersDashboard;
