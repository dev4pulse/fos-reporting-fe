import React from 'react';

const InventoryDashboard = () => {
  return (
    <div>
      <h2>Inventory Dashboard</h2>
      <form>
        <label>Fuel Type</label>
        <select>
          <option value="">Select Type</option>
          <option value="petrol">Petrol</option>
          <option value="diesel">Diesel</option>
        </select>

        <label>Quantity (Litres)</label>
        <input type="number" placeholder="Enter quantity" />

        <label>Supplier Name</label>
        <input type="text" placeholder="Enter supplier" />

        <button type="submit">Add Stock</button>
      </form>
    </div>
  );
};

export default InventoryDashboard;
