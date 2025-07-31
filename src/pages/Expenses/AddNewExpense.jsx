import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddNewExpense.css';

const AddNewExpense = () => {
  const [categories, setCategories] = useState([]);
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
    fetchCategories();
    fetchEmployeeIds();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://localhost:8080/categoryList');
      setCategories(res.data || []);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      setError('Failed to fetch categories.');
    }
  };

  const fetchEmployeeIds = async () => {
    try {
      const res = await axios.get('http://localhost:8080/active');
      setEmployeeIds(res.data);
      console.log(res.data)
    } catch (err) {
      console.error('Failed to fetch employee list:', err);
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
        employeeId: form.employeeId
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
    } catch (err) {
      console.error('Failed to add expense:', err);
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
            {categories.map((cat, idx) => (
              <option value={cat.name || cat} key={idx}>
                {cat.name || cat}
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
            {employeeIds.map((emp) => {
              let id = emp.id || emp.employeeId || emp._id || emp;
              let name = emp.name || emp.employeeName || '';
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
            max={new Date().toISOString().split('T')[0]} // Only today or past dates
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
