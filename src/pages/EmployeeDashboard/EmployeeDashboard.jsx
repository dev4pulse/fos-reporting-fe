import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const EmployeeDashboard = () => {
  return (
    // Use Bootstrap container for responsive padding and centering
    <div className="container mt-4"> {/* mt-4 adds margin-top for spacing */}
      {/* Use Bootstrap heading classes */}
      <h2 className="text-center mb-4">Employee Dashboard</h2> {/* text-center and mb-4 for spacing */}

      <form>
        {/* Form Group for Employee Name */}
        <div className="mb-3"> {/* mb-3 for margin-bottom */}
          <label htmlFor="employeeName" className="form-label">Employee Name</label> {/* form-label for proper styling */}
          <input
            type="text"
            className="form-control" // form-control for input styling
            id="employeeName"
            placeholder="Enter full name"
          />
        </div>

        {/* Form Group for Phone Number */}
        <div className="mb-3">
          <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
          <input
            type="tel"
            className="form-control"
            id="phoneNumber"
            placeholder="Enter contact number"
          />
        </div>

        {/* Form Group for Role */}
        <div className="mb-3">
          <label htmlFor="employeeRole" className="form-label">Role</label>
          <select
            className="form-select" // form-select for select styling
            id="employeeRole"
          >
            <option value="">Select Role</option>
            <option value="attendant">Attendant</option>
            <option value="manager">Manager</option>
            <option value="cashier">Cashier</option>
          </select>
        </div>

        {/* Form Group for Shift Timing */}
        <div className="mb-3">
          <label htmlFor="shiftTiming" className="form-label">Shift Timing</label>
          <input
            type="time"
            className="form-control"
            id="shiftTiming"
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary w-100 mt-3"> {/* btn and btn-primary for button styling, w-100 for full width, mt-3 for margin-top */}
          Add Employee
        </button>
      </form>
    </div>
  );
};

export default EmployeeDashboard;