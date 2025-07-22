import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrashAlt, FaPlus } from 'react-icons/fa';
import './AddCategory.css';

const AddCategory = () => {
  const [categoryName, setCategoryName] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('https://pulse-293050141084.asia-south1.run.app/categoryList');
      const list = response.data || [];
      const names = list.map(cat => cat.name || cat).filter(Boolean);
      setCategories(names);
    } catch (err) {
      setError('Failed to fetch categories. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCategory = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;
    setSuccessMsg('');
    try {
      await axios.post('https://pulse-293050141084.asia-south1.run.app/categoryPost', { name: categoryName });
      setCategoryName('');
      setSuccessMsg('Category added successfully!');
      fetchCategories();

      // Remove message after 3 seconds
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      alert('Failed to add category. Maybe it already exists?');
      console.error(err);
    }
  };

  const handleDeleteCategory = async (name) => {
    if (!window.confirm(`Delete category "${name}"?`)) return;
    try {
      await axios.delete('https://pulse-293050141084.asia-south1.run.app/categoryPost', { data: { name } });
      fetchCategories();
    } catch (err) {
      alert('Failed to delete category');
      console.error(err);
    }
  };

  return (
    <div className="add-category-container">
      <h2><FaPlus style={{ marginRight: '8px' }} />Add New Expense Category</h2>
      <form onSubmit={handleSubmitCategory}>
        <input
          type="text"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          placeholder="Category name"
          required
        />
        <button type="submit">Add</button>
      </form>

      {successMsg && <p className="success-message">{successMsg}</p>}
      {loading && <p className="loading">Loading categories...</p>}
      {error && <p className="error">{error}</p>}

      <h3>Existing Categories</h3>
      {categories.length === 0 ? (
        <p style={{ color: '#666', fontStyle: 'italic' }}>No categories yet.</p>
      ) : (
        <ul className="category-list">
          {categories.map((cat) => (
            <li key={cat}>
              {cat}
              <FaTrashAlt
                className="delete-icon"
                title="Delete category"
                onClick={() => handleDeleteCategory(cat)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AddCategory;
