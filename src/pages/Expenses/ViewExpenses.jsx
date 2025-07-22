import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrashAlt, FaPlus, FaFileAlt } from 'react-icons/fa';
import axios from 'axios';
import './ViewExpenses.css';

const ViewExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [fromDate, setFromDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split('T')[0]; // yyyy-mm-dd
  });

  const [toDate, setToDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  const [selectedCategory, setSelectedCategory] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [expenses, fromDate, toDate, selectedCategory]);

  const fetchExpenses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:8080/expensesList');
      const data = response.data || [];
      setExpenses(data);

      // Extract categories dynamically
      const uniqueCategories = [...new Set(data.map((e) => e.category))].filter(Boolean);
      setCategories(uniqueCategories);
    } catch (err) {
      setError('Failed to fetch expenses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    const from = new Date(fromDate);
    const to = new Date(toDate);
    to.setHours(23, 59, 59, 999);

    const filtered = expenses.filter((expense) => {
      const expenseDate = new Date(expense.expenseDate || expense.date);
      const matchesDate = expenseDate >= from && expenseDate <= to;
      const matchesCategory = selectedCategory ? expense.category === selectedCategory : true;
      return matchesDate && matchesCategory;
    });

    setFilteredExpenses(filtered);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;
    try {
      await axios.delete(`http://localhost:8080/expensesList/${id}`);
      setExpenses((prev) => prev.filter((e) => e._id !== id && e.id !== id));
    } catch (err) {
      alert('Failed to delete expense. Please try again.');
    }
  };

  const handleEdit = (id) => {
    navigate(`/dashboard/expenses/edit/${id}`);
  };

  const handleAddNewExpense = () => {
    navigate('/dashboard/expenses/add');
  };

  // Calculate total expenses
  const totalAmount = filteredExpenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);

  return (
    <div className="view-expenses-container">
      <div className="expenses-header">
        <h2>
          <FaFileAlt className="icon" /> View Expenses
        </h2>
        <button className="btn-add-expense" onClick={handleAddNewExpense}>
          <FaPlus /> Add New Expense
        </button>
      </div>

      {/* Filters */}
      <div className="filters-container">
        <div className="filter-item">
          <label>From:</label>
          <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        </div>
        <div className="filter-item">
          <label>To:</label>
          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
        </div>
        <div className="filter-item">
          <label>Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All</option>
            {categories.map((cat) => (
              <option value={cat} key={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Total */}
      <div className="total-amount">
        <strong>Total Expenses:</strong> ₹{totalAmount.toFixed(2)}
      </div>

      {loading && <p className="loading">Loading expenses...</p>}
      {error && <p className="error">{error}</p>}

      <div className="expenses-table-container">
        {filteredExpenses.length === 0 && !loading ? (
          <p>No expenses found for the selected criteria.</p>
        ) : (
          <table className="expenses-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Employee ID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((expense) => (
                <tr key={expense._id || expense.id}>
                  <td>
                    {expense.expenseDate || expense.date
                      ? new Date(expense.expenseDate || expense.date).toLocaleDateString()
                      : ''}
                  </td>
                  <td>{expense.description}</td>
                  <td>₹{expense.amount}</td>
                  <td>{expense.category}</td>
                  <td>{expense.employeeId}</td>
                  <td className="actions-cell">
                    <FaEdit
                      className="action-icon edit-icon"
                      onClick={() => handleEdit(expense._id || expense.id)}
                      title="Edit"
                    />
                    <FaTrashAlt
                      className="action-icon delete-icon"
                      onClick={() => handleDelete(expense._id || expense.id)}
                      title="Delete"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ViewExpenses;
