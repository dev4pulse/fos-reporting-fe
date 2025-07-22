import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddNewCustomer.css';

const AddNewCustomer = () => {
  const [form, setForm] = useState({
    customerName: '',
    customerVehicle: '',
    employeeId: '',
    amountBorrowed: '',
    borrowDate: '',
    dueDate: '',
    status: 'Pending',
    notes: '',
    customerPhone: '',
    customerAddress: '',
    customerEmail: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid = () => {
    return (
      form.customerName &&
      form.customerPhone &&
      form.amountBorrowed &&
      form.borrowDate &&
      form.dueDate
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) return;
    setError('');
    setLoading(true);
    try {
      const response = await fetch('https://pulse-293050141084.asia-south1.run.app/api/borrowers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          customerName: form.customerName,
          customerVehicle: form.customerVehicle,
          employeeId: form.employeeId,
          amountBorrowed: parseFloat(form.amountBorrowed) || 0,
          borrowDate: form.borrowDate,
          dueDate: form.dueDate,
          status: form.status,
          notes: form.notes,
          customerPhone: form.customerPhone,
          customerAddress: form.customerAddress,
          customerEmail: form.customerEmail,
        }),
      });
      if (!response.ok) throw new Error('Failed to add customer');
      navigate('/dashboard/customers/view');
    } catch (err) {
      setError(err.message || 'Error adding customer');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/customers/view');
  };

  return (
    <div className="add-new-customer-container">
      <form className="add-new-customer-form" onSubmit={handleSubmit}>
        <h2>Add New Customer</h2>
        <p className="subtext">Fill in the details to add a new customer to the system.</p>

        {error && <div className="form-error">{error}</div>}

        <div className="form-row">
          <div className="form-group">
            <label>Customer Name</label>
            <input
              type="text"
              name="customerName"
              value={form.customerName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Customer Vehicle</label>
            <input
              type="text"
              name="customerVehicle"
              value={form.customerVehicle}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Employee ID</label>
            <input
              type="text"
              name="employeeId"
              value={form.employeeId}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Amount Borrowed (₹)</label>
            <input
              type="number"
              name="amountBorrowed"
              value={form.amountBorrowed}
              onChange={handleChange}
              min="0"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Borrow Date</label>
            <input
              type="date"
              name="borrowDate"
              value={form.borrowDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
          <div className="form-group">
            <label>Notes</label>
            <input
              type="text"
              name="notes"
              value={form.notes}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="customerPhone"
              value={form.customerPhone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email ID</label>
            <input
              type="email"
              name="customerEmail"
              value={form.customerEmail}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Address</label>
          <textarea
            name="customerAddress"
            value={form.customerAddress}
            onChange={handleChange}
            rows={3}
          />
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={handleCancel} disabled={loading}>
            Cancel
          </button>
          <button type="submit" className="save-btn" disabled={!isFormValid() || loading}>
            {loading ? 'Saving...' : 'Save Customer'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNewCustomer;
