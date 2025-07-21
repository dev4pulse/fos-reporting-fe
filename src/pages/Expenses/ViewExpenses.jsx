import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrashAlt, FaPlus, FaFileAlt } from 'react-icons/fa';
import axios from 'axios';
import './ViewExpenses.css';

const ViewExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:8080/expensesList');
      setExpenses(response.data || []); // ensure always an array
    } catch (err) {
      setError('Failed to fetch expenses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;
    try {
      await axios.delete(`http://localhost:8080/expensesList/${id}`);
      setExpenses(prev => prev.filter(e => e._id !== id));
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
      {loading && <p className="loading">Loading expenses...</p>}
      {error && <p className="error">{error}</p>}
      <div className="expenses-table-container">
        {expenses.length === 0 && !loading ? (
          <p>No expenses found.</p>
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
              {expenses.map((expense) => (
                <tr key={expense._id || expense.id}>
                  <td>
                    {/* Use expense.expenseDate or fallback to expense.date; format date safely */}
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
                      onClick={() => handleEdit(expense._id)}
                      title="Edit"
                    />
                    <FaTrashAlt
                      className="action-icon delete-icon"
                      onClick={() => handleDelete(expense._id)}
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
