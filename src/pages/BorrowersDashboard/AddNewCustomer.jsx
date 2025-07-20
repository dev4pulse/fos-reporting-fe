import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddNewCustomer.css';

const AddNewCustomer = () => {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    amount: '',
    borrowDate: '',
    dueDate: '',
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
      form.name &&
      form.phone &&
      form.amount &&
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
      // Replace with your API URL
      const response = await fetch('https://your-api.com/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: form.name,
          phone_number: form.phone,
          email: form.email,
          address: form.address,
          amount_borrowed: parseFloat(form.amount) || 0,
          borrow_date: form.borrowDate,
          due_date: form.dueDate,
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
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Email ID</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Amount Borrowed (₹)</label>
            <input
              type="number"
              name="amount"
              value={form.amount}
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

        <div className="form-group">
          <label>Address</label>
          <textarea
            name="address"
            value={form.address}
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
