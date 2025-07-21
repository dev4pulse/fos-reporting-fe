import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddNewExpense.css';

const AddNewExpense = () => {
  const [categories, setCategories] = useState([
    'Food',
    'Travel',
    'Power Bill',
    'Salaries'
  ]);
  const [employeeIds, setEmployeeIds] = useState([]);
  const [form, setForm] = useState({
    category: '',
    employeeId: '',
    expenseDate: '',
    description: '',
    amount: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEmployeeIds();
    // To fetch categories dynamically, add another fetch call here.
  }, []);

  const fetchEmployeeIds = async () => {
    try {
      const res = await axios.get(
        'https://pulse-293050141084.asia-south1.run.app/active'
      );
      setEmployeeIds(res.data);
    } catch {
      setError('Failed to fetch employee list.');
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const payload = {
        description: form.description,
        amount: parseFloat(form.amount),
        category: form.category,
        expenseDate: form.expenseDate,
        employeeId: form.employeeId // always a string (ids from dropdown)
      };
      await axios.post('http://localhost:8080/expensesPost', payload);
      setMessage('Expense added successfully.');
      setForm({
        category: '',
        employeeId: '',
        expenseDate: '',
        description: '',
        amount: ''
      });
    } catch {
      setError('Failed to add expense. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-expense-container">
      <h2>Add New Expense</h2>
      <form onSubmit={handleSubmit} className="add-expense-form">
        {/* Category */}
        <div className="form-group">
          <label>Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            {categories.map(cat => (
              <option value={cat} key={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        {/* Employee Name + ID */}
        <div className="form-group">
          <label>Employee</label>
          <select
            name="employeeId"
            value={form.employeeId}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            {employeeIds.map(emp => {
              let id = emp.id || emp.employeeId || emp._id || emp;
              let name = emp.name || emp.employeeName || "";
              let label = name ? `${name} (${id})` : id;
              return (
                <option value={id} key={id}>
                  {label}
                </option>
              );
            })}
          </select>
        </div>
        {/* Date */}
        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            name="expenseDate"
            value={form.expenseDate}
            onChange={handleChange}
            required
          />
        </div>
        {/* Description */}
        <div className="form-group">
          <label>Description</label>
          <input
            type="text"
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            placeholder="e.g., Groceries, Coffee"
          />
        </div>
        {/* Amount */}
        <div className="form-group form-group-full">
          <label>Amount (₹)</label>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            required
            placeholder="e.g., 7000"
            step="0.01"
            min="0"
          />
        </div>
        <div className="form-group form-group-full">
          <button type="submit" disabled={loading}>
            {loading ? 'Adding...' : 'Add Expense'}
          </button>
        </div>
        {message && <div className="add-expense-message">{message}</div>}
        {error && <div className="add-expense-error">{error}</div>}
      </form>
    </div>
  );
};

export default AddNewExpense;
