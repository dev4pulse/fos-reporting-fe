import React from 'react';

const EmployeeDashboard = () => {
  return (
    <div>
      <h2>Employee Dashboard</h2>
      <form>
        <label>Employee Name</label>
        <input type="text" placeholder="Enter full name" />

        <label>Phone Number</label>
        <input type="tel" placeholder="Enter contact number" />

        <label>Role</label>
        <select>
          <option value="">Select Role</option>
          <option value="attendant">Attendant</option>
          <option value="manager">Manager</option>
          <option value="cashier">Cashier</option>
        </select>

        <label>Shift Timing</label>
        <input type="time" />

        <button type="submit">Add Employee</button>
      </form>
    </div>
  );
};

export default EmployeeDashboard;
