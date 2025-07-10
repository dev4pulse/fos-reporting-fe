import React from 'react';


const BorrowersDashboard = () => {
  return (
    <div>
      <h2>Borrowers Dashboard</h2>
      <form>
        <label>Borrower Name</label>
        <input type="text" placeholder="Enter name" />

        <label>Fuel/Amount Borrowed</label>
        <input type="text" placeholder="e.g. 100L Diesel or ₹5000" />

        <label>Due Date</label>
        <input type="date" />

        <label>Contact Number</label>
        <input type="tel" />

        <button type="submit">Add Borrower Record</button>
      </form>
    </div>
  );
};

export default BorrowersDashboard;
